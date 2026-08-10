use axum::{Json, extract::State, http::StatusCode};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use std::sync::Arc;
use bcrypt::verify;
use jsonwebtoken::{encode, EncodingKey, Header};
use chrono::{Utc, Duration};

#[derive(Deserialize)] pub struct LoginRequest { pub telephone: String, pub mot_de_passe: String }
#[derive(Serialize)] pub struct LoginResponse { pub token: String, pub user: UserInfo }
#[derive(Serialize, sqlx::FromRow)] pub struct UserInfo { pub id: i32, pub nom: String, pub prenom: String, pub telephone: String, pub role: String }
#[derive(Serialize, Deserialize)] struct Claims { sub: i32, role: String, exp: usize }
const SECRET: &[u8] = b"canal_secret_key_change_moi_en_prod";

pub async fn login(State(pool): State<Arc<PgPool>>, Json(p): Json<LoginRequest>) -> Result<Json<LoginResponse>, (StatusCode, String)> {
    let user = sqlx::query_as::<_, UserInfo>("SELECT id, nom, prenom, telephone, role FROM users WHERE telephone = $1").bind(&p.telephone).fetch_optional(&*pool).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?.ok_or((StatusCode::UNAUTHORIZED, "Tel ou mdp incorrect".into()))?;
    let hash: String = sqlx::query_scalar("SELECT mot_de_passe_hash FROM users WHERE id = $1").bind(user.id).fetch_one(&*pool).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    if!verify(&p.mot_de_passe, &hash).unwrap() { return Err((StatusCode::UNAUTHORIZED, "Tel ou mdp incorrect".into())) }
    let claims = Claims { sub: user.id, role: user.role.clone(), exp: (Utc::now() + Duration::hours(24)).timestamp() as usize };
    let token = encode(&Header::default(), &claims, &EncodingKey::from_secret(SECRET)).map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(LoginResponse { token, user }))
}
