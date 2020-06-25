use std::sync::Arc;
use tokio_postgres::Client;
// The GraphQL context, which needs to provide everything necessary for
// interacting with the database.
pub struct GraphQLContext {
    pub pool: Arc<Client>,
}

// This impl allows us to pass in GraphQLContext as the Context for GraphQL
// objects
impl juniper::Context for GraphQLContext {}
