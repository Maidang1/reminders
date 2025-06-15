mod scheduler;
mod store;

use crate::scheduler::ReminderScheduler;
use crate::store::*;
use std::sync::RwLock;
use std::sync::{Arc, Mutex};
use tauri::Manager;
use tauri_plugin_store::StoreExt;

#[derive(Debug, Clone)]
pub struct AppState {
    pub groups: Vec<ReminderGroup>,
    pub reminders: Vec<Reminder>,
    pub reminder_scheduler: Arc<RwLock<ReminderScheduler>>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .setup(|app| {
            let data = app.store("reminders.json").expect("Failed to access store");
            let groups: Vec<ReminderGroup> = data
                .get("groups")
                .and_then(|value| serde_json::from_value(value).ok())
                .unwrap_or_default();
            let reminders: Vec<Reminder> = data
                .get("reminders")
                .and_then(|value| serde_json::from_value(value).ok())
                .unwrap_or_default();

            let app_handle = app.handle();

            // 初始化调度器
            let reminder_scheduler =
                Arc::new(RwLock::new(ReminderScheduler::new(app_handle.clone())));
            let scheduler = reminder_scheduler.read().unwrap();
            scheduler.start_scheduler(); // 启动调度器

            let app_state = AppState {
                groups,
                reminders: reminders.clone(),
                reminder_scheduler: Arc::clone(&reminder_scheduler),
            };

            app.manage(Mutex::new(app_state));

            // 保存提醒数据的引用，稍后恢复任务
            let scheduler_clone = Arc::clone(&reminder_scheduler);
            let reminders_clone = reminders.clone();

            // 使用独立线程在应用完全初始化后恢复任务
            std::thread::spawn(move || {
                std::thread::sleep(std::time::Duration::from_millis(100)); // 给应用时间完成初始化

                let rt = tokio::runtime::Runtime::new().unwrap();
                rt.block_on(async {
                    if let Ok(mut scheduler) = scheduler_clone.write() {
                        if let Err(e) = scheduler.restore_reminder_jobs(&reminders_clone).await {
                            eprintln!("Failed to restore reminder jobs: {}", e);
                        } else {
                            println!("Successfully restored reminder jobs");
                        }
                    }
                });
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_groups,
            create_group,
            get_reminders,
            create_reminder,
            cancel_reminder,
            delete_group
        ])
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                let app_state = window.state::<Mutex<AppState>>();
                let state_guard = app_state.lock().unwrap();
                let groups = state_guard.groups.clone();
                let reminders = state_guard.reminders.clone();
                drop(state_guard); // Release the lock before doing I/O

                let app_handle = window.app_handle();
                let store = app_handle
                    .store("reminders.json")
                    .expect("Failed to access store");
                // Save groups and reminders to the store
                let _ = store.set("groups", serde_json::to_value(groups).unwrap());
                let _ = store.set("reminders", serde_json::to_value(reminders).unwrap());
                // Commit the changes to the store
                store.save().expect("Failed to save store");
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
