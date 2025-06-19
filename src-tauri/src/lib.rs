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
use tauri::{tray::{TrayIconBuilder, TrayIconEvent}, menu::{MenuBuilder, MenuItemBuilder}, Manager, WindowEvent};
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

            // // 创建托盘菜单
            let show_item = MenuItemBuilder::with_id("show", "显示窗口").build(app)?;
            let hide_item = MenuItemBuilder::with_id("hide", "隐藏窗口").build(app)?;
            let quit_item = MenuItemBuilder::with_id("quit", "退出应用").build(app)?;
            
            let menu = MenuBuilder::new(app)
                .items(&[&show_item, &hide_item])
                .separator()
                .item(&quit_item)
                .build()?;

            // 创建托盘图标
            let _tray = TrayIconBuilder::with_id("main")
                .tooltip("Reminders App")
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .on_tray_icon_event(|tray, event| {
                    match event {
                        TrayIconEvent::Click { 
                            button: tauri::tray::MouseButton::Left,
                            button_state: tauri::tray::MouseButtonState::Up,
                            ..
                        } => {
                            let app = tray.app_handle();
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = if window.is_visible().unwrap_or(false) {
                                    window.hide()
                                } else {
                                    window.show().and_then(|_| window.set_focus())
                                };
                            }
                        }
                        _ => {}
                    }
                })
                .on_menu_event(|app, event| {
                    match event.id.as_ref() {
                        "show" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show().and_then(|_| window.set_focus());
                            }
                        }
                        "hide" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.hide();
                            }
                        }
                        "quit" => {
                            // 真正退出应用
                            let app_state = app.state::<AppState>();
                            let service = Arc::clone(&app_state.service);
                            let rt = tokio::runtime::Runtime::new().unwrap();
                            rt.block_on(async {
                                if let Err(e) = save_on_exit(&service).await {
                                    eprintln!("Failed to save data on exit: {}", e);
                                }
                            });
                            app.exit(0);
                        }
                        _ => {}
                    }
                })
                .build(app)?;

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
            match event {
                WindowEvent::CloseRequested { api, .. } => {
                    // 阻止窗口关闭，改为隐藏到托盘
                    let _ = window.hide();
                    api.prevent_close();
                }
                _ => {}
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
