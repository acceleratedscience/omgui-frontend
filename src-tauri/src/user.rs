#[tauri::command]
pub fn get_user() -> String {
    whoami::username()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_get_user() {
        println!("User: {}", get_user());
    }
}
