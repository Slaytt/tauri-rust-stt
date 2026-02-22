// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn process_audio(path : String) -> String {
    println!("file received: {}", path);
    
    format!("Processed audio: {}", path)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init()) 
        .invoke_handler(tauri::generate_handler![process_audio]) 
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
