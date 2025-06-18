use crate::error::{AppError, AppResult};
use crate::models::{Reminder, ReminderGroup};
use std::sync::{Arc, RwLock};
use tauri::AppHandle;
use tauri_plugin_store::StoreExt;

pub trait DataRepository: Send + Sync {
    fn get_groups(&self) -> AppResult<Vec<ReminderGroup>>;
    fn add_group(&self, group: ReminderGroup) -> AppResult<()>;
    fn remove_group(&self, group_id: &str) -> AppResult<()>;
    
    fn get_reminders(&self) -> AppResult<Vec<Reminder>>;
    fn add_reminder(&self, reminder: Reminder) -> AppResult<()>;
    fn update_reminder(&self, reminder: &Reminder) -> AppResult<()>;
    fn remove_reminder(&self, reminder_id: &str) -> AppResult<()>;
    fn find_reminder(&self, reminder_id: &str) -> AppResult<Option<Reminder>>;
    fn find_reminders_by_group(&self, group_id: &str) -> AppResult<Vec<Reminder>>;
}

pub struct InMemoryRepository {
    groups: Arc<RwLock<Vec<ReminderGroup>>>,
    reminders: Arc<RwLock<Vec<Reminder>>>,
}

impl InMemoryRepository {
    pub fn new(groups: Vec<ReminderGroup>, reminders: Vec<Reminder>) -> Self {
        Self {
            groups: Arc::new(RwLock::new(groups)),
            reminders: Arc::new(RwLock::new(reminders)),
        }
    }
}

impl DataRepository for InMemoryRepository {
    fn get_groups(&self) -> AppResult<Vec<ReminderGroup>> {
        let groups = self
            .groups
            .read()
            .map_err(|e| AppError::DataAccess(format!("Failed to read groups: {}", e)))?;
        Ok(groups.clone())
    }

    fn add_group(&self, group: ReminderGroup) -> AppResult<()> {
        let mut groups = self
            .groups
            .write()
            .map_err(|e| AppError::DataAccess(format!("Failed to write groups: {}", e)))?;
        groups.push(group);
        Ok(())
    }

    fn remove_group(&self, group_id: &str) -> AppResult<()> {
        let mut groups = self
            .groups
            .write()
            .map_err(|e| AppError::DataAccess(format!("Failed to write groups: {}", e)))?;
        groups.retain(|g| g.id != group_id);
        Ok(())
    }

    fn get_reminders(&self) -> AppResult<Vec<Reminder>> {
        let reminders = self
            .reminders
            .read()
            .map_err(|e| AppError::DataAccess(format!("Failed to read reminders: {}", e)))?;
        Ok(reminders.clone())
    }

    fn add_reminder(&self, reminder: Reminder) -> AppResult<()> {
        let mut reminders = self
            .reminders
            .write()
            .map_err(|e| AppError::DataAccess(format!("Failed to write reminders: {}", e)))?;
        reminders.push(reminder);
        Ok(())
    }

    fn update_reminder(&self, reminder: &Reminder) -> AppResult<()> {
        let mut reminders = self
            .reminders
            .write()
            .map_err(|e| AppError::DataAccess(format!("Failed to write reminders: {}", e)))?;
        
        if let Some(existing) = reminders.iter_mut().find(|r| r.id == reminder.id) {
            *existing = reminder.clone();
            Ok(())
        } else {
            Err(AppError::NotFound(format!("Reminder with id {} not found", reminder.id)))
        }
    }

    fn remove_reminder(&self, reminder_id: &str) -> AppResult<()> {
        let mut reminders = self
            .reminders
            .write()
            .map_err(|e| AppError::DataAccess(format!("Failed to write reminders: {}", e)))?;
        
        let initial_len = reminders.len();
        reminders.retain(|r| r.id != reminder_id);
        
        if reminders.len() == initial_len {
            Err(AppError::NotFound(format!("Reminder with id {} not found", reminder_id)))
        } else {
            Ok(())
        }
    }

    fn find_reminder(&self, reminder_id: &str) -> AppResult<Option<Reminder>> {
        let reminders = self
            .reminders
            .read()
            .map_err(|e| AppError::DataAccess(format!("Failed to read reminders: {}", e)))?;
        
        Ok(reminders.iter().find(|r| r.id == reminder_id).cloned())
    }

    fn find_reminders_by_group(&self, group_id: &str) -> AppResult<Vec<Reminder>> {
        let reminders = self
            .reminders
            .read()
            .map_err(|e| AppError::DataAccess(format!("Failed to read reminders: {}", e)))?;
        
        Ok(reminders.iter()
            .filter(|r| r.group_id == group_id)
            .cloned()
            .collect())
    }
}

pub struct PersistenceManager {
    app_handle: AppHandle,
}

impl PersistenceManager {
    pub fn new(app_handle: AppHandle) -> Self {
        Self { app_handle }
    }

    pub fn load_data(&self) -> AppResult<(Vec<ReminderGroup>, Vec<Reminder>)> {
        let store = self
            .app_handle
            .store("reminders.json")
            .map_err(|e| AppError::Persistence(format!("Failed to access store: {}", e)))?;

        let groups: Vec<ReminderGroup> = store
            .get("groups")
            .and_then(|value| serde_json::from_value(value).ok())
            .unwrap_or_default();

        let reminders: Vec<Reminder> = store
            .get("reminders")
            .and_then(|value| serde_json::from_value(value).ok())
            .unwrap_or_default();

        Ok((groups, reminders))
    }

    pub fn save_data(&self, groups: &[ReminderGroup], reminders: &[Reminder]) -> AppResult<()> {
        let store = self
            .app_handle
            .store("reminders.json")
            .map_err(|e| AppError::Persistence(format!("Failed to access store: {}", e)))?;

        store
            .set("groups", serde_json::to_value(groups).map_err(|e| {
                AppError::Persistence(format!("Failed to serialize groups: {}", e))
            })?);

        store
            .set("reminders", serde_json::to_value(reminders).map_err(|e| {
                AppError::Persistence(format!("Failed to serialize reminders: {}", e))
            })?);

        store
            .save()
            .map_err(|e| AppError::Persistence(format!("Failed to save store: {}", e)))?;

        Ok(())
    }
}
