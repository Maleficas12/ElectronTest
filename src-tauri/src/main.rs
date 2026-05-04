use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct AppInfo {
    app_name: String,
    app_version: String,
    platform: String,
}

#[tauri::command]
fn get_app_info(app: tauri::AppHandle) -> AppInfo {
    AppInfo {
        app_name: app.package_info().name.clone(),
        app_version: app.package_info().version.to_string(),
        platform: std::env::consts::OS.to_string(),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_app_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
