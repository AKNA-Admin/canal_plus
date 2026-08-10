use axum::{http::Request, middleware::Next, response::Response, http::StatusCode};
use jsonwebtoken::{decode, DecodingKey, Validation};

pub async fn auth<B>(req: Request<B>, next: Next<B>) -> Result<Response, StatusCode> {
    let token = req.headers().get("Authorization").and_then(|v| v.to_str().ok()).and_then(|s| s.strip_prefix("Bearer "));
    if token.is_none() { return Err(StatusCode::UNAUTHORIZED) }
    decode::<serde_json::Value>(token.unwrap(), &DecodingKey::from_secret(b"canal_secret_key_change_moi_en_prod"), &Validation::default()).map_err(|_| StatusCode::UNAUTHORIZED)?;
    Ok(next.run(req).await)
}
