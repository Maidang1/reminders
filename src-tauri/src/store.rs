use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::State;

use crate::AppState;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReminderGroup {
    pub id: String,
    pub name: String,
    pub color: String,
    pub start_at: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Reminder {
    pub id: String,
    pub title: String,
    pub color: String,
    pub group_id: String,
    pub cron_expression: Option<String>, // cron expression for scheduling
    pub start_at: i64,
    pub last_triggered: Option<i64>,
    pub is_cancelled: bool,
    pub is_deleted: bool,
    pub is_paused: bool,
    pub description: Option<String>,
}

#[tauri::command]
pub async fn get_groups(state: State<'_, Mutex<AppState>>) -> Result<Vec<ReminderGroup>, String> {
    let state = state
        .lock()
        .map_err(|e| format!("Failed to lock state: {}", e))?;
    let groups = state.groups.clone();

    Ok(groups)
}

#[tauri::command]
pub async fn create_group(
    name: String,
    color: String,
    state: State<'_, Mutex<AppState>>,
) -> Result<ReminderGroup, String> {
    let group = ReminderGroup {
        id: uuid::Uuid::new_v4().to_string(),
        name,
        color,
        start_at: chrono::Utc::now().timestamp(),
    };

    let mut state = state
        .lock()
        .map_err(|e| format!("Failed to lock state: {}", e))?;
    state.groups.push(group.clone());

    Ok(group)
}

#[tauri::command]
pub async fn get_reminders(state: State<'_, Mutex<AppState>>) -> Result<Vec<Reminder>, String> {
    let state = state
        .lock()
        .map_err(|e| format!("Failed to lock state: {}", e))?;
    let reminders = state.reminders.clone();

    Ok(reminders)
}

#[tauri::command]
pub async fn create_reminder(
    title: String,
    color: String,
    group_id: String,
    cron_expression: Option<String>,
    description: Option<String>,
    state: State<'_, Mutex<AppState>>,
) -> Result<Reminder, String> {
    let now = chrono::Utc::now().timestamp();
    let reminder = Reminder {
        id: uuid::Uuid::new_v4().to_string(),
        title,
        color,
        group_id,
        start_at: now,
        last_triggered: None,
        is_cancelled: false,
        is_deleted: false,
        is_paused: false,
        cron_expression,
        description,
    };

    let mut state = state
        .lock()
        .map_err(|e| format!("Failed to lock state: {}", e))?;
    state.reminders.push(reminder.clone());

    println!("Created reminder: {:?} {:?}", reminder, state.reminders);
    Ok(reminder)
}

#[tauri::command]
pub async fn cancel_reminder(
    reminder_id: String,
    state: State<'_, Mutex<AppState>>,
) -> Result<(), String> {
    let mut state = state
        .lock()
        .map_err(|e| format!("Failed to lock state: {}", e))?;
    let mut reminders = state.reminders.clone();

    if let Some(reminder) = reminders.iter_mut().find(|r| r.id == reminder_id) {
        reminder.is_cancelled = true;
        state.reminders = reminders;
        Ok(())
    } else {
        Err("Reminder not found".to_string())
    }
}

#[tauri::command]
pub async fn delete_group(
    group_id: String,
    state: State<'_, Mutex<AppState>>,
) -> Result<(), String> {
    let mut state = state
        .lock()
        .map_err(|e| format!("Failed to lock state: {}", e))?;
    state.groups.retain(|g| g.id != group_id);
    state.reminders.retain(|r| r.group_id != group_id);
    Ok(())
}
