// utils used by the nestapi.
use uuid::Uuid;

// get the first element of a vector
pub fn first<T>(v: &Vec<T>) -> Option<&T> {
    v.first()
}

pub fn create_api_key() -> String {
    Uuid::new_v4().to_simple().to_string()
}
