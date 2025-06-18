use crate::models::{CreateGroupRequest, CreateReminderRequest, Reminder, ReminderGroup, UpdateReminderRequest};
use crate::service::ReminderService;
use std::sync::Arc;
use tauri::State;

pub struct AppState {
    pub service: Arc<ReminderService>,
}

#[tauri::command]
pub async fn get_groups(state: State<'_, AppState>) -> Result<Vec<ReminderGroup>, String> {
    state.service.get_groups().await.map_err(|e| e.into())
}

#[tauri::command]
pub async fn create_group(
    name: String,
    color: String,
    state: State<'_, AppState>,
) -> Result<ReminderGroup, String> {
    let request = CreateGroupRequest { name, color };
    state.service.create_group(request).await.map_err(|e| e.into())
}

#[tauri::command]
pub async fn delete_group(group_id: String, state: State<'_, AppState>) -> Result<(), String> {
    state.service.delete_group(&group_id).await.map_err(|e| e.into())
}

#[tauri::command]
pub async fn get_reminders(state: State<'_, AppState>) -> Result<Vec<Reminder>, String> {
    state.service.get_reminders().await.map_err(|e| e.into())
}

#[tauri::command]
pub async fn create_reminder(
    title: String,
    color: String,
    group_id: String,
    cron_expression: Option<String>,
    description: Option<String>,
    start_at: Option<String>,
    end_at: Option<String>,
    state: State<'_, AppState>,
) -> Result<Reminder, String> {
    let request = CreateReminderRequest {
        title,
        color,
        group_id,
        cron_expression,
        description,
        start_at,
        end_at,
    };
    state.service.create_reminder(request).await.map_err(|e| e.into())
}

#[tauri::command]
pub async fn update_reminder(
    reminder_id: String,
    title: Option<String>,
    color: Option<String>,
    cron_expression: Option<String>,
    description: Option<String>,
    start_at: Option<String>,
    end_at: Option<String>,
    state: State<'_, AppState>,
) -> Result<Reminder, String> {
    let request = UpdateReminderRequest {
        title,
        color,
        cron_expression,
        description,
        start_at,
        end_at,
    };
    state.service.update_reminder(&reminder_id, request).await.map_err(|e| e.into())
}

#[tauri::command]
pub async fn pause_reminder(
    reminder_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    state.service.pause_reminder(&reminder_id).await.map_err(|e| e.into())
}

#[tauri::command]
pub async fn resume_reminder(
    reminder_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    state.service.resume_reminder(&reminder_id).await.map_err(|e| e.into())
}

#[tauri::command]
pub async fn cancel_reminder(
    reminder_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    state.service.cancel_reminder(&reminder_id).await.map_err(|e| e.into())
}

#[tauri::command]
pub async fn delete_reminder(
    reminder_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    state.service.delete_reminder(&reminder_id).await.map_err(|e| e.into())
}
