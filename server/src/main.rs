mod routes;
use routes::{vente::create_vente, options::get_options};

let app = Router::new()
    .route("/api/vente", post(create_vente))
    .route("/api/options", get(get_options)) // <-- AJOUTE ÇA
    .with_state(pool);
