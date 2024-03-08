// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;
use std::path::Path;
use tauri::Manager;

use window_shadows::set_shadow;

#[tauri::command]
async fn transfer_vid() -> String {
    let args: Vec<String> = env::args().collect();
    if args.len() == 2 {
        let path: String = args[1].clone();
        // let vid_content: Vec<u8> = fs::read(path).expect("Should have read video file");
        // let vid_data: String = general_purpose::STANDARD.encode(&vid_content);
        return path;
    } else {
        "Faulty arguments".into()
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![transfer_vid])
        .setup(|app| {
            let main_win = app.get_window("main").unwrap();
            set_shadow(&main_win, true).unwrap();

            let args: Vec<String> = env::args().collect();
            if args.len() == 2 {
                let path: String = args[1].clone();
                app.asset_protocol_scope()
                    .allow_file(Path::new(&path))
                    .unwrap();
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
