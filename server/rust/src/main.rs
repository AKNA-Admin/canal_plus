use axum::{Router, routing::{get, post}};
use tower_http::cors::{CorsLayer, AllowOrigin, Any}; // Ajoute AllowOrigin
use http::HeaderValue;
use std::sync::Arc;

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();
    let database_url = std::env::var("DATABASE_URL").unwrap();
    let pool = Arc::new(sqlx::PgPool::connect(&database_url).await.unwrap());

    // AUTORISE TOUS LES .VERCEL.APP = PROD + PREVIEW GITHUB
    let cors = CorsLayer::new()
        .allow_origin(AllowOrigin::exact("https://mycanalpluspdv.ips-2tbat.ci/".parse().unwrap()))
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/api/vente", post(routes::vente::create_vente))
        .route("/api/options", get(routes::options::get_options))
        .route("/api/formules", get(routes::formules::get_formules))
        .layer(cors) // Important: avant with_state
        .with_state(pool);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
