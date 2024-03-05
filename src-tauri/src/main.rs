// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::Path;
use std::env;
use tauri::Manager;

#[tauri::command]
async fn transfer_vid() -> String {
    let args: Vec<String> = env::args().collect();
    if args.len() == 2 {
        let path: String = args[1].clone();
        // let vid_content: Vec<u8> = fs::read(path).expect("Should have read video file");
        // let vid_data: String = general_purpose::STANDARD.encode(&vid_content);
				println!("Return path: {}", path);
        return path;
    } else {
        "C:/Users/vladb/Videos/Genshin Impact/Genshin Impact 2024.01.05 - 13.25.40.03.DVR.mp4"
            .into()
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![transfer_vid])
        .setup(|app| {
            let args: Vec<String> = env::args().collect();
						if args.len() == 2 {
							let path: String = args[1].clone();
							println!("Path: {}", path);
							println!("App fs_scope: {}", app.fs_scope().is_allowed(Path::new(&path)));
							app.asset_protocol_scope().allow_file(Path::new(&path)).unwrap();
							println!("App fs_scope after change: {}", app.fs_scope().is_allowed(Path::new(&path)));
						}
						
						Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
