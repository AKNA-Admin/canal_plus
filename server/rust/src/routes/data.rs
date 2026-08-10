// data.rs
use axum::{Json, extract::State};
use sqlx::PgPool;
use std::sync::Arc;
#[derive(serde::Serialize, sqlx::FromRow)] pub struct Formule { pub id: i32, pub nom: String, pub prix: i32, pub prix_kit: i32, pub prix_installation: i32 }
#[derive(serde::Serialize, sqlx::FromRow)] pub struct OptionItem { pub id: i32, pub nom: String, pub type_option: String, pub prix: i32 }
pub async fn get_formules(State(pool): State<Arc<PgPool>>) -> Json<Vec<Formule>> { Json(sqlx::query_as("SELECT * FROM formules").fetch_all(&*pool).await.unwrap()) }
pub async fn get_options(State(pool): State<Arc<PgPool>>) -> Json<Vec<OptionItem>> { Json(sqlx::query_as("SELECT * FROM options").fetch_all(&*pool).await.unwrap()) }
