mod commands;
mod error;
mod models;
mod repository;
mod scheduler;
mod service;
mod utils;

use commands::AppState;
use repository::{InMemoryRepository, PersistenceManager};
use scheduler::ReminderScheduler;
use service::ReminderService;
use std::sync::Arc;
use tauri::Manager;
use tokio::sync::RwLock;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .setup(|app| {
            // 初始化持久化管理器
            let persistence = Arc::new(PersistenceManager::new(app.handle().clone()));
            
            // 加载数据
            let (groups, reminders) = persistence.load_data()
                .map_err(|e| format!("Failed to load data: {}", e))?;

            // 创建仓库
            let repository = Arc::new(InMemoryRepository::new(groups, reminders.clone()));

            // 创建调度器
            let scheduler = Arc::new(RwLock::new(ReminderScheduler::new(
                app.handle().clone(),
                Arc::clone(&repository) as Arc<dyn repository::DataRepository>,
            )));

            // 创建服务
            let service = Arc::new(ReminderService::new(
                Arc::clone(&repository) as Arc<dyn repository::DataRepository>,
                Arc::clone(&scheduler),
                Arc::clone(&persistence),
            ));

            // 创建应用状态
            let app_state = AppState { service: Arc::clone(&service) };
            app.manage(app_state);

            // 在新线程中启动调度器和恢复任务
            let scheduler_clone = Arc::clone(&scheduler);
            let service_clone = Arc::clone(&service);
            std::thread::spawn(move || {
                let rt = tokio::runtime::Runtime::new().unwrap();
                rt.block_on(async {
                    // 启动调度器
                    {
                        let scheduler_guard = scheduler_clone.read().await;
                        scheduler_guard.start_scheduler();
                    }
                    
                    // 稍等一下让调度器初始化
                    tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
                    
                    // 恢复调度任务
                    if let Err(e) = service_clone.restore_reminder_jobs().await {
                        eprintln!("Failed to restore reminder jobs: {}", e);
                    } else {
                        println!("Successfully restored reminder jobs");
                    }
                });
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_groups,
            commands::create_group,
            commands::delete_group,
            commands::get_reminders,
            commands::create_reminder,
            commands::update_reminder,
            commands::pause_reminder,
            commands::resume_reminder,
            commands::cancel_reminder,
            commands::delete_reminder,
        ])
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                let app_state = window.state::<AppState>();
                
                // 同步保存数据
                let service = Arc::clone(&app_state.service);
                let rt = tokio::runtime::Runtime::new().unwrap();
                rt.block_on(async {
                    if let Err(e) = save_on_exit(&service).await {
                        eprintln!("Failed to save data on exit: {}", e);
                    }
                });
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

async fn save_on_exit(service: &ReminderService) -> Result<(), error::AppError> {
    let groups = service.get_groups().await?;
    let reminders = service.get_reminders().await?;
    // 实际的保存逻辑已经在service内部的save_data方法中处理
    println!("Data saved on exit: {} groups, {} reminders", groups.len(), reminders.len());
    Ok(())
}
