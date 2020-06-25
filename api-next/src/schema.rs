//! Juniper GraphQL handling done here
use crate::context::GraphQLContext;
use crate::db::{get_package, get_user_by_key};
use juniper::FieldResult;
use juniper::RootNode;
use juniper::{GraphQLInputObject, GraphQLObject};
use std::sync::Arc;
use tokio::runtime::Runtime;
use tokio_postgres::Client;

// Define GraphQL schema for package retrival
#[derive(GraphQLObject)]
#[graphql(description = "A nest.land package")]
pub struct Package {
    pub name: String,
    pub normalizedName: String,
    pub owner: String,
    pub description: String,
    pub repository: String,
    pub latestVersion: String,
    pub latestStableVersion: String,
    pub packageUploadNames: Vec<String>,
    pub locked: bool,
    pub malicious: bool,
    pub unlisted: bool,
    pub updatedAt: String,
    pub createdAt: String,
}

// Define GraphQL schema for User retrival
#[derive(GraphQLObject)]
#[graphql(description = "A nest.land package author")]
pub struct User {
    pub name: String,
    pub normalizedName: String,
    pub apiKey: String,
    pub packageNames: Vec<String>,
    pub createdAt: String,
}

// Define graphql schema for NewPackage
#[derive(GraphQLInputObject)]
#[graphql(description = "A nest.land package")]
struct NewPackage {
    name: String,
    normalizedName: String,
    owner: String,
    description: String,
    repository: String,
    latestVersion: String,
    latestStableVersion: String,
    packageUploadNames: Vec<String>,
    locked: bool,
    malicious: bool,
    unlisted: bool,
    updatedAt: String,
    createdAt: String,
}

pub struct QueryRoot;

// Define QueryRoot for GraphQL
#[juniper::object(Context = GraphQLContext)]
impl QueryRoot {
    fn package(ctx: &GraphQLContext, name: String) -> FieldResult<Package> {
        Ok(Runtime::new()
            .unwrap()
            .block_on(get_package(Arc::clone(&ctx.pool), name))?)
    }
    fn user(ctx: &GraphQLContext, apiKey: String) -> FieldResult<User> {
        Ok(Runtime::new()
            .unwrap()
            .block_on(get_user_by_key(Arc::clone(&ctx.pool), apiKey))?)
    }
}

pub struct MutationRoot;

// Define MutationRoot for GraphQL
#[juniper::object(Context = GraphQLContext)]
impl MutationRoot {
    fn create_package(ctx: &GraphQLContext, new_package: NewPackage) -> FieldResult<Package> {
        Ok(Package {
            name: new_package.name.to_owned(),
            normalizedName: new_package.name.to_owned(),
            owner: new_package.normalizedName.to_owned(),
            description: new_package.description.to_owned(),
            repository: new_package.repository.to_owned(),
            latestVersion: new_package.latestVersion.to_owned(),
            latestStableVersion: new_package.latestStableVersion.to_owned(),
            packageUploadNames: new_package.packageUploadNames,
            locked: false,
            malicious: false,
            unlisted: false,
            updatedAt: "sometime".to_owned(),
            createdAt: "sometime".to_owned(),
        })
    }
}

pub type Schema = RootNode<'static, QueryRoot, MutationRoot>;

// Expose create schema method
pub fn create_schema() -> Schema {
    Schema::new(QueryRoot {}, MutationRoot {})
}
