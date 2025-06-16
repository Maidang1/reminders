use serde::{Deserialize, Serialize};
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
pub async fn get_groups(state: State<'_, AppState>) -> Result<Vec<ReminderGroup>, String> {
    let groups = state.groups.read()
        .map_err(|e| format!("Failed to read groups: {}", e))?;
    Ok(groups.clone())
}

#[tauri::command]
pub async fn create_group(
    name: String,
    color: String,
    state: State<'_, AppState>,
) -> Result<ReminderGroup, String> {
    let group = ReminderGroup {
        id: uuid::Uuid::new_v4().to_string(),
        name,
        color,
        start_at: chrono::Utc::now().timestamp(),
    };

    let mut groups = state.groups.write()
        .map_err(|e| format!("Failed to write groups: {}", e))?;
    groups.push(group.clone());

    Ok(group)
}

#[tauri::command]
pub async fn get_reminders(state: State<'_, AppState>) -> Result<Vec<Reminder>, String> {
    let reminders = state.reminders.read()
        .map_err(|e| format!("Failed to read reminders: {}", e))?;
    Ok(reminders.clone())
}

#[tauri::command]
pub async fn create_reminder(
    title: String,
    color: String,
    group_id: String,
    cron_expression: Option<String>,
    description: Option<String>,
    state: State<'_, AppState>,
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

    // 添加到 reminders 列表
    let mut reminders = state.reminders.write()
        .map_err(|e| format!("Failed to write reminders: {}", e))?;
    reminders.push(reminder.clone());
    drop(reminders); // 释放写锁

    // 在一个新的线程中添加提醒任务
    let scheduler = state.reminder_scheduler.clone();
    let reminder_for_job = reminder.clone();
    std::thread::spawn(move || {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            if let Ok(mut scheduler_guard) = scheduler.write() {
                if let Err(e) = scheduler_guard.add_reminder_job(&reminder_for_job).await {
                    eprintln!("Failed to add reminder job: {}", e);
                }
            }
        });
    });

    println!("Created reminder: {:?}", reminder);
    Ok(reminder)
}

#[tauri::command]
pub async fn cancel_reminder(
    reminder_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let mut reminders = state.reminders.write()
        .map_err(|e| format!("Failed to write reminders: {}", e))?;

    if let Some(reminder) = reminders.iter_mut().find(|r| r.id == reminder_id) {
        reminder.is_cancelled = true;
        println!("Cancelled reminder: {}", reminder_id);
        Ok(())
    } else {
        Err("Reminder not found".to_string())
    }
}

#[tauri::command]
pub async fn delete_group(
    group_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    // 删除组
    let mut groups = state.groups.write()
        .map_err(|e| format!("Failed to write groups: {}", e))?;
    groups.retain(|g| g.id != group_id);
    drop(groups);

    // 获取要删除的 reminder IDs
    let reminders = state.reminders.read()
        .map_err(|e| format!("Failed to read reminders: {}", e))?;
    let reminder_ids: Vec<String> = reminders
        .iter()
        .filter(|r| r.group_id == group_id)
        .map(|r| r.id.clone())
        .collect();
    drop(reminders);

    // 删除相关的 reminders
    let mut reminders = state.reminders.write()
        .map_err(|e| format!("Failed to write reminders: {}", e))?;
    reminders.retain(|r| r.group_id != group_id);
    drop(reminders);

    // 移除相关的调度任务
    for reminder_id in reminder_ids {
        if let Ok(scheduler) = state.reminder_scheduler.read() {
            if let Err(e) = scheduler.remove_reminder_job(&reminder_id) {
                eprintln!("Failed to remove reminder job {}: {}", reminder_id, e);
            }
        }
    }

    println!("Deleted group with ID: {}", group_id);
    Ok(())
}

#[tauri::command]
pub async fn update_reminder(
    reminder_id: String,
    title: Option<String>,
    color: Option<String>,
    cron_expression: Option<String>,
    description: Option<String>,
    start_at: Option<i64>,
    state: State<'_, AppState>,
) -> Result<Reminder, String> {
    let mut reminders = state.reminders.write()
        .map_err(|e| format!("Failed to write reminders: {}", e))?;

    if let Some(reminder) = reminders.iter_mut().find(|r| r.id == reminder_id) {
        let cron_changed = cron_expression.is_some();
        let start_changed = start_at.is_some();
        
        if let Some(title) = title {
            reminder.title = title;
        }
        if let Some(color) = color {
            reminder.color = color;
        }
        if let Some(cron_expression) = cron_expression {
            reminder.cron_expression = Some(cron_expression);
        }
        if let Some(description) = description {
            reminder.description = Some(description);
        }
        if let Some(start_at) = start_at {
            reminder.start_at = start_at;
        }

        let updated_reminder = reminder.clone();
        drop(reminders);

        // 如果时间或 cron 表达式有变化，重新添加调度任务
        if start_changed || cron_changed {
            let scheduler = state.reminder_scheduler.clone();
            let reminder_for_job = updated_reminder.clone();
            std::thread::spawn(move || {
                let rt = tokio::runtime::Runtime::new().unwrap();
                rt.block_on(async {
                    if let Ok(scheduler_guard) = scheduler.read() {
                        // 先移除旧任务
                        if let Err(e) = scheduler_guard.remove_reminder_job(&reminder_for_job.id) {
                            eprintln!("Failed to remove old reminder job: {}", e);
                        }
                    }
                    if let Ok(mut scheduler_guard) = scheduler.write() {
                        // 添加新任务
                        if let Err(e) = scheduler_guard.add_reminder_job(&reminder_for_job).await {
                            eprintln!("Failed to add updated reminder job: {}", e);
                        }
                    }
                });
            });
        }

        println!("Updated reminder: {:?}", updated_reminder);
        Ok(updated_reminder)
    } else {
        Err("Reminder not found".to_string())
    }
}

#[tauri::command]
pub async fn pause_reminder(
    reminder_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let mut reminders = state.reminders.write()
        .map_err(|e| format!("Failed to write reminders: {}", e))?;

    if let Some(reminder) = reminders.iter_mut().find(|r| r.id == reminder_id) {
        reminder.is_paused = true;
        println!("Paused reminder: {}", reminder_id);
        Ok(())
    } else {
        Err("Reminder not found".to_string())
    }
}

#[tauri::command]
pub async fn resume_reminder(
    reminder_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let mut reminders = state.reminders.write()
        .map_err(|e| format!("Failed to write reminders: {}", e))?;

    if let Some(reminder) = reminders.iter_mut().find(|r| r.id == reminder_id) {
        reminder.is_paused = false;
        println!("Resumed reminder: {}", reminder_id);
        Ok(())
    } else {
        Err("Reminder not found".to_string())
    }
}

#[tauri::command]
pub async fn delete_reminder(
    reminder_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let mut reminders = state.reminders.write()
        .map_err(|e| format!("Failed to write reminders: {}", e))?;

    if let Some(reminder) = reminders.iter_mut().find(|r| r.id == reminder_id) {
        reminder.is_deleted = true;
        println!("Deleted reminder: {}", reminder_id);
        
        // 移除调度任务
        drop(reminders);
        if let Ok(scheduler) = state.reminder_scheduler.read() {
            if let Err(e) = scheduler.remove_reminder_job(&reminder_id) {
                eprintln!("Failed to remove reminder job {}: {}", reminder_id, e);
            }
        }
        
        Ok(())
    } else {
        Err("Reminder not found".to_string())
    }
}
