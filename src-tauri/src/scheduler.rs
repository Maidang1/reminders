use crate::store::Reminder;
use english_to_cron::str_cron_syntax;
use job_scheduler::{Job, JobScheduler};
use std::collections::HashMap;
use std::fmt::Debug;
use std::sync::{Arc, Mutex};
use tauri::AppHandle;
use tauri_plugin_notification::NotificationExt;

extern crate uuid;

// 为 JobScheduler 创建一个包装器，实现 Send + Sync
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
        self.scheduler.tick()
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
}

impl ReminderScheduler {
    pub fn new(app_handle: AppHandle) -> Self {
        Self {
            scheduler: Arc::new(Mutex::new(SendSyncJobScheduler::new())),
            job_ids: Arc::new(Mutex::new(HashMap::new())),
            app_handle,
        }
    }

    /// 添加新的提醒任务
    pub async fn add_reminder_job(&mut self, reminder: &Reminder) -> Result<(), String> {
        let reminder_title = reminder.title.clone();
        let start_at = reminder.start_at;
        let cron_expression = &reminder
            .cron_expression
            .clone()
            .unwrap_or(format!("Run only at once on {}", start_at).to_string());

        // 创建定时任务
        let cron_expr = str_cron_syntax(&cron_expression)
            .map_err(|e| format!("Invalid cron expression: {}", e))?;

        let app_handle = self.app_handle.clone();
        let title_clone = reminder_title.clone();

        let job = Job::new(
            cron_expr
                .parse()
                .map_err(|e| format!("Invalid cron expression: {}", e))?,
            move || {
                if let Err(e) =
                    ReminderScheduler::send_notification_sync_internal(&app_handle, &title_clone)
                {
                    eprintln!("Failed to send notification: {}", e);
                }
            },
        );

        // Store the job ID

        let mut scheduler = self
            .scheduler
            .lock()
            .map_err(|e| format!("Failed to lock scheduler: {}", e))?;

        let job_id = scheduler.add(job);

        let mut job_ids = self
            .job_ids
            .lock()
            .map_err(|e| format!("Failed to lock job_ids: {}", e))?;

        job_ids.insert(reminder.id.clone(), job_id);

        Ok(())
    }

    /// 移除提醒任务
    pub fn remove_reminder_job(&self, reminder_id: &str) -> Result<(), String> {
        let mut job_ids = self
            .job_ids
            .lock()
            .map_err(|e| format!("Failed to lock job_ids: {}", e))?;

        if let Some(job_id) = job_ids.remove(reminder_id) {
            let mut scheduler = self
                .scheduler
                .lock()
                .map_err(|e| format!("Failed to lock scheduler: {}", e))?;
            scheduler.remove(job_id);
            println!("Removed reminder job for: {}", reminder_id);
        }

        Ok(())
    }

    /// 内部使用的发送通知方法
    fn send_notification_sync_internal(app_handle: &AppHandle, title: &str) -> Result<(), String> {
        app_handle
            .notification()
            .builder()
            .title("提醒")
            .body(title)
            .show()
            .map_err(|e| e.to_string())?;

        println!("Sent notification: {}", title);
        Ok(())
    }

    /// 恢复所有活跃的提醒任务
    pub async fn restore_reminder_jobs(&mut self, reminders: &[Reminder]) -> Result<(), String> {
        let now = chrono::Utc::now().timestamp();

        for reminder in reminders {
            // 只恢复未取消且未过期的提醒
            if !reminder.is_cancelled && !reminder.is_paused && now < reminder.start_at as i64 {
                if let Err(e) = self.add_reminder_job(reminder).await {
                    eprintln!(
                        "Failed to restore reminder job for {}: {}",
                        reminder.title, e
                    );
                }
            }
        }

        println!("Restored {} reminder jobs", reminders.len());
        Ok(())
    }

    /// 启动调度器
    pub fn start_scheduler(&self) {
        let scheduler = Arc::clone(&self.scheduler);
        std::thread::spawn(move || loop {
            if let Ok(mut sched) = scheduler.lock() {
                sched.tick();
            }
            std::thread::sleep(std::time::Duration::from_secs(500));
        });
    }
}

impl Clone for ReminderScheduler {
    fn clone(&self) -> Self {
        Self {
            scheduler: Arc::clone(&self.scheduler),
            job_ids: Arc::clone(&self.job_ids),
            app_handle: self.app_handle.clone(),
        }
    }
}

impl Debug for ReminderScheduler {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("ReminderScheduler").finish()
    }
}
