// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use app::openad;
use app::user::{__cmd__get_user, get_user};
use tauri::{CustomMenuItem, Menu};

fn main() {
    let close = CustomMenuItem::new("close", "Close");

    let menu = Menu::new().add_item(close);

    let open = openad::OpenAD::new();

    let mut app = tauri::Builder::default()
        .menu(menu)
        .on_menu_event(|event| {
            if let "close" = event.menu_item_id() {
                event.window().close().unwrap();
            }
        })
        .invoke_handler(tauri::generate_handler![get_user])
        .build(tauri::generate_context!())
        .unwrap();

    loop {
        let iteration = app.run_iteration();
        // intercept signal to close the app

        if iteration.window_count == 0 {
            drop(open);
            break;
        }
    }
}
