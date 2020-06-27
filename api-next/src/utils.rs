// utils used by the nestapi.
use uuid::Uuid;

let invalidChars: Vec<char> = vec!['!', '[', ']', '.', ':', ' '];

// get the first element of a vector
pub fn first<T>(v: &Vec<T>) -> Option<&T> {
    v.first()
}

pub fn create_api_key() -> String {
    Uuid::new_v4().to_simple().to_string()
}

pub fn normalize(input: &str) -> String {
    input.to_lowercase().chars().map(|x| match x {
        invalidChars.contains(&x) => '_',
        _ => x
    }).collect()
}
