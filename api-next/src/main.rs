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
            .service(web::resource("/graphql").route(web::post().to(graphql)))
            .service(web::resource("/graphiql").route(web::get().to(graphiql)))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
