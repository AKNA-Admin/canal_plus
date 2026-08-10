// data.rs
use axum::{Json, extract::State};
use sqlx::PgPool;
use std::sync::Arc;
#[derive(serde::Serialize, sqlx::FromRow)] pub struct Formule { pub id: i32, pub nom: String, pub prix: i32, pub prix_kit: i32, pub prix_installation: i32 }
#[derive(serde::Serialize, sqlx::FromRow)] pub struct OptionItem { pub id: i32, pub nom: String, pub type_option: String, pub prix: i32 }
pub async fn get_formules(State(pool): State<Arc<PgPool>>) -> Json<Vec<Formule>> { Json(sqlx::query_as("SELECT * FROM formules").fetch_all(&*pool).await.unwrap()) }
pub async fn get_options(State(pool): State<Arc<PgPool>>) -> Json<Vec<OptionItem>> { Json(sqlx::query_as("SELECT * FROM options").fetch_all(&*pool).await.unwrap()) }

// vente.rs
use axum::{Json, extract::State, http::StatusCode};
use serde::Deserialize;
#[derive(Deserialize)] pub struct VenteRequest { pub pdv_id: i32, pub client_nom: String, pub client_tel: String, pub formule_id: i32, pub montant_total: i32 }
pub async fn create_vente(State(pool): State<Arc<sqlx::PgPool>>, Json(p): Json<VenteRequest>) -> Result<Json<&'static str>, StatusCode> {
    sqlx::query("INSERT INTO ventes (pdv_id, client_nom, client_tel, formule_id, montant_total) VALUES ($1,$2,$3,$4,$5)").bind(p.pdv_id).bind(p.client_nom).bind(p.client_tel).bind(p.formule_id).bind(p.montant_total).execute(&*pool).await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json("Vente enregistrée"))
}

// mod.rs
pub mod auth; pub mod data; pub mod vente;
