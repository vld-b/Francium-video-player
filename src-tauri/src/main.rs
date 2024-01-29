// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;
use std::fs;
use base64::{engine::general_purpose, Engine as _};

#[tauri::command]
fn transfer_vid() -> String {
  let args: Vec<String> = env::args().collect();
  if args.len() == 2 {
    let path: String = args[1].clone();
    let vid_content: Vec<u8> = fs::read(path).expect("Should have read video file");
    let vid_data: String = general_purpose::STANDARD.encode(&vid_content);
    return vid_data;
  } else {
    "Wrong arguments".into()
  }
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![transfer_vid])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
