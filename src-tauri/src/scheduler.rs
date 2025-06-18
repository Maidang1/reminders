use crate::error::{AppError, AppResult};
use crate::models::Reminder;
use crate::repository::DataRepository;
use crate::utils::get_current_time;
use english_to_cron::str_cron_syntax;
use job_scheduler_ng::{Job, JobScheduler};
use std::collections::HashMap;
use std::fmt::Debug;
use std::sync::{Arc, Mutex};
use tauri::AppHandle;
use tauri_plugin_notification::NotificationExt;

extern crate uuid;

pub struct SendSyncJobScheduler {
    scheduler: JobScheduler<'static>,
}

impl SendSyncJobScheduler {
    fn new() -> Self {
        Self {
            scheduler: JobScheduler::new(),
        }
    }

    fn add(&mut self, job: Job<'static>) -> uuid::Uuid {
        self.scheduler.add(job)
    }

    fn remove(&mut self, id: uuid::Uuid) -> bool {
        self.scheduler.remove(id)
    }

    fn tick(&mut self) {
        self.scheduler.tick();
    }
}

impl Debug for SendSyncJobScheduler {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("SendSyncJobScheduler").finish()
    }
}

// 手动实现 Send 和 Sync
unsafe impl Send for SendSyncJobScheduler {}
unsafe impl Sync for SendSyncJobScheduler {}

pub struct ReminderScheduler {
    scheduler: Arc<Mutex<SendSyncJobScheduler>>,
    job_ids: Arc<Mutex<HashMap<String, uuid::Uuid>>>,
    app_handle: AppHandle,
    repository: Arc<dyn DataRepository>,
}

impl ReminderScheduler {
    pub fn new(app_handle: AppHandle, repository: Arc<dyn DataRepository>) -> Self {
        Self {
            scheduler: Arc::new(Mutex::new(SendSyncJobScheduler::new())),
            job_ids: Arc::new(Mutex::new(HashMap::new())),
            app_handle,
            repository,
        }
    }

    /// 添加新的提醒任务
    pub async fn add_reminder_job(&mut self, reminder: &Reminder) -> AppResult<()> {
        let cron_expression = reminder.cron_expression.as_ref()
            .ok_or_else(|| AppError::Validation("Cron expression is required".to_string()))?;

        let reminder_id = reminder.id.clone();
        let reminder_title = reminder.title.clone();

        // 创建定时任务
        let cron_expr = str_cron_syntax(cron_expression)
            .map_err(|e| AppError::Scheduler(format!("Invalid cron expression: {}", e)))?;

        let app_handle = self.app_handle.clone();
        let title_clone = reminder_title.clone();
        let repository = Arc::clone(&self.repository);
        let reminder_id_clone = reminder_id.clone();

        let job = Job::new(
            cron_expr
                .parse()
                .map_err(|e| AppError::Scheduler(format!("Invalid cron expression: {}", e)))?,
            move || {
                // 实时检查 reminder 状态
                if let Ok(Some(current_reminder)) = repository.find_reminder(&reminder_id_clone) {
                    // 检查 reminder 是否处于活跃状态
                    if !current_reminder.is_active() {
                        println!(
                            "Reminder {} is not active, skipping notification",
                            current_reminder.title
                        );
                        return;
                    }

                    let (hour, minutes) = get_current_time();
                    let now = chrono::NaiveTime::parse_from_str(
                        format!("{}:{}", hour, minutes).as_str(),
                        "%H:%M",
                    )
                    .ok();

                    // 检查结束时间
                    if let Some(end_at) = &current_reminder.end_at {
                        let end_time = chrono::NaiveTime::parse_from_str(end_at, "%H:%M").ok();
                        if end_time.is_some()
                            && now.is_some()
                            && now.unwrap() > end_time.unwrap()
                        {
                            println!(
                                "Reminder {} has ended, skipping notification",
                                current_reminder.title
                            );
                            return;
                        }
                    }

                    // 检查开始时间
                    if let Some(start_at) = &current_reminder.start_at {
                        let start_time =
                            chrono::NaiveTime::parse_from_str(start_at, "%H:%M").ok();
                        if start_time.is_some()
                            && now.is_some()
                            && now.unwrap() < start_time.unwrap()
                        {
                            println!(
                                "Reminder {} has not started yet, skipping notification",
                                current_reminder.title
                            );
                            return;
                        }
                    }

                    // 发送通知
                    if let Err(e) = Self::send_notification_sync_internal(
                        &app_handle,
                        &title_clone,
                    ) {
                        eprintln!("Failed to send notification: {}", e);
                    }

                    // 更新 last_triggered 时间
                    let mut updated_reminder = current_reminder.clone();
                    updated_reminder.update_last_triggered();
                    if let Err(e) = repository.update_reminder(&updated_reminder) {
                        eprintln!("Failed to update reminder last_triggered: {}", e);
                    }
                } else {
                    println!(
                        "Reminder {} not found, skipping notification",
                        reminder_id_clone
                    );
                }
            },
        );

        // 存储任务ID
        let mut scheduler = self
            .scheduler
            .lock()
            .map_err(|e| AppError::Internal(format!("Failed to lock scheduler: {}", e)))?;

        let job_id = scheduler.add(job);

        let mut job_ids = self
            .job_ids
            .lock()
            .map_err(|e| AppError::Internal(format!("Failed to lock job_ids: {}", e)))?;

        job_ids.insert(reminder.id.clone(), job_id);

        Ok(())
    }

    /// 移除提醒任务
    pub fn remove_reminder_job(&self, reminder_id: &str) -> AppResult<()> {
        let mut job_ids = self
            .job_ids
            .lock()
            .map_err(|e| AppError::Internal(format!("Failed to lock job_ids: {}", e)))?;

        if let Some(job_id) = job_ids.remove(reminder_id) {
            let mut scheduler = self
                .scheduler
                .lock()
                .map_err(|e| AppError::Internal(format!("Failed to lock scheduler: {}", e)))?;
            scheduler.remove(job_id);
            println!("Removed reminder job for: {}", reminder_id);
        } else {
            println!("Reminder job not found for: {}", reminder_id);
        }

        Ok(())
    }

    /// 内部使用的发送通知方法
    fn send_notification_sync_internal(app_handle: &AppHandle, title: &str) -> AppResult<()> {
        app_handle
            .notification()
            .builder()
            .title("提醒")
            .body(title)
            .show()
            .map_err(|e| AppError::Scheduler(format!("Failed to send notification: {}", e)))?;

        println!("Sent notification: {}", title);
        Ok(())
    }

    /// 恢复所有活跃的提醒任务
    pub async fn restore_reminder_jobs(&mut self, reminders: &[Reminder]) -> AppResult<()> {
        let (hour, minutes) = get_current_time();

        let now =
            chrono::NaiveTime::parse_from_str(format!("{}:{}", hour, minutes).as_str(), "%H:%M")
                .ok();

        for reminder in reminders {
            // 只恢复活跃的提醒
            if reminder.is_active() {
                let end_at = if let Some(end_at) = reminder.end_at.clone() {
                    chrono::NaiveTime::parse_from_str(&end_at, "%H:%M").ok()
                } else {
                    None
                };

                // 如果提醒已经结束，跳过
                if let (Some(end_time), Some(current_time)) = (end_at, now) {
                    if end_time <= current_time {
                        println!(
                            "Skipping reminder {} as it has already ended at {}",
                            reminder.title, end_time
                        );
                        continue;
                    }
                }

                if let Err(e) = self.add_reminder_job(reminder).await {
                    eprintln!(
                        "Failed to restore reminder job for {}: {}",
                        reminder.title, e
                    );
                }
            }
        }

        println!("Restored reminder jobs for {} reminders", reminders.len());
        Ok(())
    }

    /// 启动调度器
    pub fn start_scheduler(&self) {
        let scheduler = Arc::clone(&self.scheduler);
        std::thread::spawn(move || loop {
            if let Ok(mut sched) = scheduler.lock() {
                sched.tick();
            }
            std::thread::sleep(std::time::Duration::from_millis(500));
        });
    }
}

impl Clone for ReminderScheduler {
    fn clone(&self) -> Self {
        Self {
            scheduler: Arc::clone(&self.scheduler),
            job_ids: Arc::clone(&self.job_ids),
            app_handle: self.app_handle.clone(),
            repository: Arc::clone(&self.repository),
        }
    }
}

impl Debug for ReminderScheduler {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("ReminderScheduler").finish()
    }
}
