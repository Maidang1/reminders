use crate::error::{AppError, AppResult};
use crate::models::{CreateGroupRequest, CreateReminderRequest, Reminder, ReminderGroup, UpdateReminderRequest};
use crate::repository::{DataRepository, PersistenceManager};
use crate::scheduler::ReminderScheduler;
use std::sync::Arc;
use tokio::sync::RwLock;

pub struct ReminderService {
    repository: Arc<dyn DataRepository>,
    scheduler: Arc<RwLock<ReminderScheduler>>,
    persistence: Arc<PersistenceManager>,
}

impl ReminderService {
    pub fn new(
        repository: Arc<dyn DataRepository>,
        scheduler: Arc<RwLock<ReminderScheduler>>,
        persistence: Arc<PersistenceManager>,
    ) -> Self {
        Self {
            repository,
            scheduler,
            persistence,
        }
    }

    pub async fn get_groups(&self) -> AppResult<Vec<ReminderGroup>> {
        self.repository.get_groups()
    }

    pub async fn create_group(&self, request: CreateGroupRequest) -> AppResult<ReminderGroup> {
        let group = ReminderGroup::new(request.name, request.color);
        self.repository.add_group(group.clone())?;
        self.save_data().await?;
        Ok(group)
    }

    pub async fn delete_group(&self, group_id: &str) -> AppResult<()> {
        // 获取要删除的提醒
        let reminders_to_delete = self.repository.find_reminders_by_group(group_id)?;
        
        // 删除所有相关的调度任务
        let scheduler = self.scheduler.read().await;
        for reminder in &reminders_to_delete {
            if let Err(e) = scheduler.remove_reminder_job(&reminder.id) {
                eprintln!("Failed to remove reminder job {}: {}", reminder.id, e);
            }
        }
        drop(scheduler);

        // 删除组和相关提醒
        self.repository.remove_group(group_id)?;
        for reminder in &reminders_to_delete {
            self.repository.remove_reminder(&reminder.id)?;
        }

        self.save_data().await?;
        println!("Deleted group with ID: {}", group_id);
        Ok(())
    }

    pub async fn get_reminders(&self) -> AppResult<Vec<Reminder>> {
        self.repository.get_reminders()
    }

    pub async fn create_reminder(&self, request: CreateReminderRequest) -> AppResult<Reminder> {
        let reminder = Reminder::new(
            request.title,
            request.color,
            request.group_id,
            request.cron_expression,
            request.description,
            request.start_at,
            request.end_at,
        );

        // 添加到仓库
        self.repository.add_reminder(reminder.clone())?;

        // 添加调度任务
        let mut scheduler = self.scheduler.write().await;
        if let Err(e) = scheduler.add_reminder_job(&reminder).await {
            eprintln!("Failed to add reminder job: {}", e);
        }
        drop(scheduler);

        self.save_data().await?;
        println!("Created reminder: {:?}", reminder);
        Ok(reminder)
    }

    pub async fn update_reminder(
        &self,
        reminder_id: &str,
        request: UpdateReminderRequest,
    ) -> AppResult<Reminder> {
        let mut reminder = self
            .repository
            .find_reminder(reminder_id)?
            .ok_or_else(|| AppError::NotFound(format!("Reminder with id {} not found", reminder_id)))?;

        let schedule_changed = reminder.update(
            request.title,
            request.color,
            request.cron_expression,
            request.description,
            request.start_at,
            request.end_at,
        );

        self.repository.update_reminder(&reminder)?;

        // 如果调度信息发生变化，重新设置调度任务
        if schedule_changed {
            let scheduler = self.scheduler.read().await;
            // 先移除旧任务
            if let Err(e) = scheduler.remove_reminder_job(&reminder.id) {
                eprintln!("Failed to remove old reminder job: {}", e);
            }
            drop(scheduler);

            // 添加新任务
            let mut scheduler = self.scheduler.write().await;
            if let Err(e) = scheduler.add_reminder_job(&reminder).await {
                eprintln!("Failed to add updated reminder job: {}", e);
            }
        }

        self.save_data().await?;
        println!("Updated reminder: {:?}", reminder);
        Ok(reminder)
    }

    pub async fn pause_reminder(&self, reminder_id: &str) -> AppResult<()> {
        let mut reminder = self
            .repository
            .find_reminder(reminder_id)?
            .ok_or_else(|| AppError::NotFound(format!("Reminder with id {} not found", reminder_id)))?;

        reminder.pause();
        self.repository.update_reminder(&reminder)?;
        self.save_data().await?;
        println!("Paused reminder: {}", reminder_id);
        Ok(())
    }

    pub async fn resume_reminder(&self, reminder_id: &str) -> AppResult<()> {
        let mut reminder = self
            .repository
            .find_reminder(reminder_id)?
            .ok_or_else(|| AppError::NotFound(format!("Reminder with id {} not found", reminder_id)))?;

        reminder.resume();
        self.repository.update_reminder(&reminder)?;
        self.save_data().await?;
        println!("Resumed reminder: {}", reminder_id);
        Ok(())
    }

    pub async fn cancel_reminder(&self, reminder_id: &str) -> AppResult<()> {
        let mut reminder = self
            .repository
            .find_reminder(reminder_id)?
            .ok_or_else(|| AppError::NotFound(format!("Reminder with id {} not found", reminder_id)))?;

        reminder.cancel();
        self.repository.update_reminder(&reminder)?;
        self.save_data().await?;
        println!("Cancelled reminder: {}", reminder_id);
        Ok(())
    }

    pub async fn delete_reminder(&self, reminder_id: &str) -> AppResult<()> {
        let mut reminder = self
            .repository
            .find_reminder(reminder_id)?
            .ok_or_else(|| AppError::NotFound(format!("Reminder with id {} not found", reminder_id)))?;

        reminder.delete();
        self.repository.update_reminder(&reminder)?;

        // 移除调度任务
        let scheduler = self.scheduler.read().await;
        if let Err(e) = scheduler.remove_reminder_job(reminder_id) {
            eprintln!("Failed to remove reminder job {}: {}", reminder_id, e);
        }

        self.save_data().await?;
        println!("Deleted reminder: {}", reminder_id);
        Ok(())
    }

    pub async fn restore_reminder_jobs(&self) -> AppResult<()> {
        let reminders = self.repository.get_reminders()?;
        let mut scheduler = self.scheduler.write().await;
        scheduler.restore_reminder_jobs(&reminders).await?;
        Ok(())
    }

    async fn save_data(&self) -> AppResult<()> {
        let groups = self.repository.get_groups()?;
        let reminders = self.repository.get_reminders()?;
        self.persistence.save_data(&groups, &reminders)?;
        Ok(())
    }
}
