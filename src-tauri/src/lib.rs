mod store;

use crate::store::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            get_groups,
            create_group,
            get_reminders,
            create_reminder,
            cancel_reminder,
            delete_group
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
