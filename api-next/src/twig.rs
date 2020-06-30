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
