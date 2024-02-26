use std::process::Child;
use std::{env, process::Command};

pub struct OpenAD(Option<Child>);

impl OpenAD {
    pub fn new() -> Self {
        env::set_current_dir("/Users/dchoi/Documents/ibm/python/open-ad-toolkit/").unwrap();

        let child_result = Command::new("poetry").arg("run").arg("openad").spawn();

        match child_result {
            Ok(child) => OpenAD(Some(child)),
            Err(_) => OpenAD(None),
        }
    }
}

impl Default for OpenAD {
    fn default() -> Self {
        Self::new()
    }
}

impl Drop for OpenAD {
    fn drop(&mut self) {
        if let Some(mut child) = self.0.take() {
            println!("Killing openad");
            child.kill().expect("Failed to kill openad");
        }
    }
}

// #[cfg(test)]
// mod tests {
//     use std::{thread::sleep, time::Duration};
//
//     use super::*;
//     #[test]
//     fn test_start_openad() {
//         let openad = OpenAD::new();
//         sleep(Duration::from_secs(10));
//         drop(openad);
//         sleep(Duration::from_secs(5));
//     }
// }
