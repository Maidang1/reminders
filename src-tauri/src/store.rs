use serde::{Deserialize, Serialize};
use serde_json::json;
use std::sync::Mutex;
use tauri_plugin_store::{Store, StoreExt};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReminderGroup {
    pub id: String,
    pub name: String,
    pub color: String,
    pub created_at: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Reminder {
    pub id: String,
    pub title: String,
    pub color: String,
    pub group_id: String,
    pub repeat_interval: u64, // in seconds
    pub repeat_duration: u64, // in seconds, how long to repeat
    pub created_at: i64,
    pub last_triggered: Option<i64>,
    pub is_cancelled: bool,
    pub next_trigger: i64,
}

#[tauri::command]
pub async fn get_groups<R: tauri::Runtime>(
    app_handle: tauri::AppHandle<R>,
) -> Result<Vec<ReminderGroup>, String> {
    let store = app_handle
        .store("reminders.json")
        .map_err(|e| format!("Failed to access store: {}", e))?;

    let groups: Vec<ReminderGroup> = store
        .get("groups")
        .and_then(|value| serde_json::from_value(value).ok())
        .unwrap_or_default();

    Ok(groups)
}

#[tauri::command]
pub async fn create_group<R: tauri::Runtime>(
    name: String,
    color: String,
    app_handle: tauri::AppHandle<R>,
) -> Result<ReminderGroup, String> {
    let group = ReminderGroup {
        id: uuid::Uuid::new_v4().to_string(),
        name,
        color,
        created_at: chrono::Utc::now().timestamp(),
    };

    let store = app_handle
        .store("reminders.json")
        .map_err(|e| format!("Failed to access store: {}", e))?;
    let mut groups: Vec<ReminderGroup> = store
        .get("groups")
        .and_then(|value| serde_json::from_value(value).ok())
        .unwrap_or_default();
    groups.push(group.clone());
    store.set("groups", json!(groups));
    Ok(group)
}

#[tauri::command]
pub async fn get_reminders<R: tauri::Runtime>(
    app_handle: tauri::AppHandle<R>,
) -> Result<Vec<Reminder>, String> {
    let store = app_handle
        .store("reminders.json")
        .map_err(|e| format!("Failed to access store: {}", e))?;

    let reminders: Vec<Reminder> = store
        .get("reminders")
        .and_then(|value| serde_json::from_value(value).ok())
        .unwrap_or_default();

    Ok(reminders)
}

#[tauri::command]
pub async fn create_reminder<R: tauri::Runtime>(
    title: String,
    color: String,
    group_id: String,
    repeat_interval: u64,
    repeat_duration: u64,
    app_handle: tauri::AppHandle<R>,
) -> Result<Reminder, String> {
    let now = chrono::Utc::now().timestamp();
    let reminder = Reminder {
        id: uuid::Uuid::new_v4().to_string(),
        title,
        color,
        group_id,
        repeat_interval,
        repeat_duration,
        created_at: now,
        last_triggered: None,
        is_cancelled: false,
        next_trigger: now + repeat_interval as i64,
    };

    let store = app_handle
        .store("reminders.json")
        .map_err(|e| format!("Failed to access store: {}", e))?;
    let mut reminders: Vec<Reminder> = store
        .get("reminders")
        .and_then(|value| serde_json::from_value(value).ok())
        .unwrap_or_default();
    reminders.push(reminder.clone());
    store.set("reminders", json!(reminders));
    Ok(reminder)
}

#[tauri::command]
pub async fn cancel_reminder<R: tauri::Runtime>(
    reminder_id: String,
    app_handle: tauri::AppHandle<R>,
) -> Result<(), String> {
    let store = app_handle
        .store("reminders.json")
        .map_err(|e| format!("Failed to access store: {}", e))?;
    let mut reminders: Vec<Reminder> = store
        .get("reminders")
        .and_then(|value| serde_json::from_value(value).ok())
        .unwrap_or_default();

    if let Some(reminder) = reminders.iter_mut().find(|r| r.id == reminder_id) {
        reminder.is_cancelled = true;
        store.set("reminders", json!(reminders));
        Ok(())
    } else {
        Err("Reminder not found".to_string())
    }
}

#[tauri::command]
pub async fn delete_group<R: tauri::Runtime>(
    group_id: String,
    app_handle: tauri::AppHandle<R>,
) -> Result<(), String> {
    let store = app_handle
        .store("reminders.json")
        .map_err(|e| format!("Failed to access store: {}", e))?;
    let mut groups: Vec<ReminderGroup> = store
        .get("groups")
        .and_then(|value| serde_json::from_value(value).ok())
        .unwrap_or_default();
    let mut reminders: Vec<Reminder> = store
        .get("reminders")
        .and_then(|value| serde_json::from_value(value).ok())
        .unwrap_or_default();

    groups.retain(|g| g.id != group_id);
    reminders.retain(|r| r.group_id != group_id);

    store.set("groups", json!(groups));

    store.set("reminders", json!(reminders));

    Ok(())
}
