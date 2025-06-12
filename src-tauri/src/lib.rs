mod store;

use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::Manager;
use tauri_plugin_store::StoreExt;

use crate::store::*;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppState {
    groups: Vec<ReminderGroup>,
    reminders: Vec<Reminder>,
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
            app.manage(Mutex::new(AppState {
                groups,
                reminders,
            }));

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
                let state = app_state.lock().unwrap();
                let groups = state.groups.clone();
                let reminders = state.reminders.clone();
                let app_handle = window.app_handle();
                let store = app_handle
                    .store("reminders.json")
                    .expect("Failed to access store");
                // Save groups and reminders to the store
                let _ = store.set("groups", serde_json::to_value(groups).unwrap());
                let _ = store.set("reminders", serde_json::to_value(reminders).unwrap());
                // Commit the changes to the store
                store.save().expect("Failed to save store");
                // Save the current state to the store
                // let _ = window.store("reminders.json", &*state);
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
