// Postgres database management for Nest API

use crate::schema::{NewUser, Package, User};
use crate::utils::{create_api_key, first, normalize};
use chrono::{DateTime, Utc};
use postgres_array::array::Array;
use std::sync::Arc;
use std::time::SystemTime;
use tokio_postgres::{Client, Error, NoTls};
use dotenv;

// establish connection with Postgres db
pub async fn connect() -> Result<Client, Error> {
    let host = dotenv::var("DB_HOST").unwrap_or("localhost".to_string());
    let user = dotenv::var("DB_USER").unwrap_or("nest".to_string());
    let database_name = dotenv::var("DB_NAME").unwrap_or("nest".to_string());
    let pass = dotenv::var("DB_PASS").unwrap_or("123".to_string());
    let (client, connection) =
        tokio_postgres::connect(&format!("host={} user={} dbname={} password={}", host, user, database_name, pass), NoTls).await?;

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
        .await
        .unwrap();
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
            updatedAt: format!("{:?}", row.get::<usize, DateTime<Utc>>(11)),
            createdAt: format!("{:?}", row.get::<usize, DateTime<Utc>>(12)),
        })
    } else {
        Err("Not found".to_string())
    }
}

// Method to retrieve a user from db
pub async fn get_user_by_key(db: Arc<Client>, apiKey: String) -> Result<User, String> {
    let rows = &db
        .query("SELECT * FROM users WHERE apiKey = $1", &[&apiKey])
        .await
        .unwrap();
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

// Method to create a user
pub async fn create_user(db: Arc<Client>, newUser: NewUser) -> Result<User, Error> {
    let apiKey = create_api_key();
    let normalizedName = normalize(&newUser.name);
    let rows = &db
        .query("INSERT INTO users (name, normalizedName, password, apiKey, packageNames, createdAt) VALUES ($1, $2, $3, $4, $5, $6)", &[&newUser.name, &normalizedName, &newUser.password, &apiKey, &Array::<String>::from_vec(vec![], 0), &Utc::now()])
        .await?;
    let name = newUser.name;
    Ok(User {
        name: name,
        normalizedName: normalizedName,
        apiKey: apiKey,
        packageNames: vec![],
        createdAt: format!("{:?}", Utc::now()),
    })
}
