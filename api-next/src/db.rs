// Postgres database management for Nest API

use crate::schema::{Package, User};
use crate::utils::first;
use std::sync::Arc;
use std::time::SystemTime;
use tokio_postgres::{Client, Error, NoTls};
use postgres_array::array::Array;
use chrono::{Utc, DateTime};

// establish connection with Postgres db
pub async fn connect() -> Result<Client, Error> {
    let (client, connection) =
        tokio_postgres::connect("host=localhost user=nest dbname=nest password=123", NoTls).await?;

    // The connection object performs the actual communication with the database,
    // so spawn it off to run on its own.
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    Ok(client)
}

// Method to retrieve a package from db
pub async fn get_package(db: Arc<Client>, name: String) -> Result<Package, String> {
    let rows = &db
        .query("SELECT * FROM packages WHERE name = $1", &[&name])
        .await.unwrap();
    let _row = first(rows);
    if let Some(x) = _row {
        let row = _row.unwrap();
        let uploadNames: Array<String> = row.get(7);
        Ok(Package {
            name: row.get(0),
            normalizedName: row.get(1),
            owner: row.get(2),
            description: row.get(3),
            repository: row.get(4),
            latestVersion: row.get(5),
            latestStableVersion: row.get(6),
            packageUploadNames: uploadNames.iter().cloned().collect(),
            locked: row.get(8),
            malicious: row.get(9),
            unlisted: row.get(10),
            updatedAt: format!("{:?}", SystemTime::now()),
            createdAt: format!("{:?}", SystemTime::now()),
        })
    } else {
        Err("Not found".to_string())
    }
}

// Method to retrieve a user from db
pub async fn get_user_by_key(db: Arc<Client>, apiKey: String) -> Result<User, String> {
    let rows = &db
        .query("SELECT * FROM users WHERE apiKey = $1", &[&apiKey])
        .await.unwrap();
    let _row = first(rows);
    if let Some(x) = _row {
        let row = _row.unwrap();
        let packageNames: Array<String> = row.get(4);
        Ok(User {
            name: row.get(0),
            normalizedName: row.get(1),
            apiKey: row.get(3),
            packageNames: packageNames.iter().cloned().collect(),
            createdAt: format!("{:?}", row.get::<usize, DateTime<Utc>>(5)),
        })
    } else {
        Err("Not found".to_string())
    }
}
