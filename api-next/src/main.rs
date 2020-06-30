//! Actix + Juniper + Tokio-Postgres
//!
//! Juniper with actix-web
use std::io;
use std::sync::Arc;

use actix_cors::Cors;
use actix_web::{middleware, web, App, Error, HttpResponse, HttpServer};
use juniper::http::graphiql::graphiql_source;
use juniper::http::GraphQLRequest;
use std::borrow::Borrow;
use tokio_postgres::Client;
use actix_multipart::Multipart;
use futures::{StreamExt, TryStreamExt};
use std::io::Write;
use std::collections::HashMap;

mod context;
mod db;
mod schema;
mod utils;
mod twig;

use crate::schema::{create_schema, Schema};

async fn graphiql() -> HttpResponse {
    let html = graphiql_source("http://127.0.0.1:8080/graphql");
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(html)
}

async fn graphql(
    st: web::Data<AppState>,
    data: web::Json<GraphQLRequest>,
) -> Result<HttpResponse, Error> {
    let user = web::block(move || {
        let res = data.execute(
            &st.st,
            &context::GraphQLContext {
                pool: Arc::clone(&st.pool),
            },
        );
        Ok::<_, serde_json::error::Error>(serde_json::to_string(&res)?)
    })
    .await?;
    Ok(HttpResponse::Ok()
        .content_type("application/json")
        .body(user))
}

// TODO: use this struct
pub struct OngoingUpload {
    packageName: String,
    done: bool
}

async fn upload_package(mut parts: awmp::Parts) -> Result<HttpResponse, Error> {
    let text_fields: HashMap<_, _> = parts.texts.as_pairs().into_iter().collect();

    text_fields.get("owner");

    let file_parts = parts
        .files
        .into_inner()
        .into_iter()
        .flat_map(|(name, res_tf)| res_tf.map(|x| (name, x)))
        .map(|(name, tf)| tf.persist("./tmp").map(|f| (name, f)))
        .collect::<Result<Vec<_>, _>>()
        .unwrap()
        .into_iter()
        .map(|(name, f)| format!("{}: {}", name, f.display()))
        .collect::<Vec<_>>()
        .join(", ");

    Ok(actix_web::HttpResponse::Ok().body(file_parts))
}


async fn index(st: web::Data<AppState>,
data: web::Json<GraphQLRequest>) -> Result<HttpResponse, Error> {
    Ok(HttpResponse::Ok().body("Welcome to Nest.land's Rust API"))
}


pub struct AppState {
    pool: Arc<Client>,
    st: Arc<Schema>,
}

#[actix_rt::main]
async fn main() -> io::Result<()> {
    std::env::set_var("RUST_LOG", "actix_web=info");
    env_logger::init();
    let client = db::connect().await.unwrap();
    // Create Juniper schema
    let schema = std::sync::Arc::new(create_schema());
    let conn = std::sync::Arc::new(client);
    // Start http server
    HttpServer::new(move || {
        App::new()
            .wrap(Cors::new().supports_credentials().finish())
            .data(AppState {
                st: schema.clone(),
                pool: conn.clone(),
            })
            .wrap(middleware::Logger::default())
            .service(web::resource("/").route(web::get().to(index)))
            .service(web::resource("/graphql").route(web::post().to(graphql)))
            .service(web::resource("/graphiql").route(web::get().to(graphiql)))
            .service(web::resource("/package").route(web::post().to(upload_package)))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
