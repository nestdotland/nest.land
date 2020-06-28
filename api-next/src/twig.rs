//! This example illustrates the way to send and receive statically typed JSON.
//!
//! In contrast to the arbitrary JSON example, this brings up the full power of
//! Rust compile-time type system guaranties though it requires a little bit
//! more code.

// These require the `serde` dependency.
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct NewTx {
    tmpID: String
}

#[derive(Debug, Serialize, Deserialize)]
struct PostTx {
    txID: String,
    name: String,
    relativePath: String
}

pub async fn tx(tmpID: String) -> Result<PostTx, reqwest::Error> {
    let newTx = NewTx {
        tmpID: tmpID
    };
    let txDone: PostTx = reqwest::Client::new()
        .post("http://localhost:3000/tx/new")
        .json(&newTx)
        .send()
        .await?
        .json()
        .await?;

    Ok(txDone)
}
