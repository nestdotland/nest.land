// utils used by the nestapi.

// get the first element of a vector
pub fn first<T>(v: &Vec<T>) -> Option<&T> {
    v.first()
}
