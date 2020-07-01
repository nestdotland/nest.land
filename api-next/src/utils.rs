// utils used by the nestapi.
use uuid::Uuid;

// get the first element of a vector
pub fn first<T>(v: &Vec<T>) -> Option<&T> {
    v.first()
}

// generate a random api_key
pub fn create_api_key() -> String {
    Uuid::new_v4().to_simple().to_string()
}

// normalize string
pub fn normalize(input: &str) -> String {
    input
        .to_lowercase()
        .chars()
        .map(|x| match x {
            '!' => '_',
            '[' => '_',
            ']' => '_',
            '.' => '_',
            ':' => '_',
            _ => x,
        })
        .collect()
}
