import { useState } from 'react';

export default function RechargeCompte() {
  const [montant, setMontant] = useState('');
  const [preuveUrl, setPreuveUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const pdvId = 1; // Remplacé par l'utilisateur connecté plus tard

  // Fonction pour ouvrir la caméra / galerie avec Cloudinary
  const ouvrirWidgetCloudinary = () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: 'demo', // À remplacer par votre Cloud Name Cloudinary réel
        uploadPreset: 'ml_default', // Votre dossier de stockage Cloudinary
        sources: ['local', 'camera'],
        multiple: false
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setPreuveUrl(result.info.secure_url); // On récupère le lien internet de l'image
          setMessage("📸 Reçu photo enregistré avec succès !");
        }
      }
    );
  };

  const formInvalide = !montant || !preuveUrl;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formInvalide) return;

    setLoading(true);
    setMessage('Envoi de votre versement à l\'administrateur...');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/versements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdv_id: pdvId,
          montant: Number(montant),
          preuve_recu_url: preuveUrl // Transmet le lien de l'image stockée
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Versement envoyé ! Un administrateur va créditer votre solde après vérification.");
        setMontant('');
        setPreuveUrl('');
      } else {
        setMessage(`❌ Erreur : ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Erreur de connexion avec le serveur Render.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', height: '44px', padding: '0 12px', marginTop: '6px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontStyle: 'italic', fontSize: '15px' };
  const labelStyle = { fontWeight: '700', color: '#222', fontSize: '14px' };

  return (
    <div style={{ padding: '25px', maxWidth: '420px', margin: '10px auto', fontFamily: 'Segoe UI, sans-serif', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderRadius: '12px', backgroundColor: '#fff' }}>
      <h2 style={{ textAlign: 'center', fontWeight: '800', fontSize: '20px', marginBottom: '20px' }}>💰 VERSEMENT EN BANQUE</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Montant versé (F CFA) :</label>
          <input type="number" value={montant} onChange={(e) => setMontant(e.target.value)} required style={inputStyle} placeholder="Ex: 250000" />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Preuve de dépôt Mobile Money :</label>
          <button 
            type="button" 
            onClick={ouvrirWidgetCloudinary} 
            style={{ ...inputStyle, backgroundColor: '#f0f0f0', border: '1px dashed #777', fontWeight: '700', fontStyle: 'normal', cursor: 'pointer' }}
          >
            {preuveUrl ? "🔄 Remplacer la photo du reçu" : "📸 Prendre une Photo / Choisir l'image"}
          </button>
        </div>

        <button type="submit" disabled={loading || formInvalide} style={{ width: '100%', height: '46px', backgroundColor: formInvalide ? '#aaa' : '#000', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '15px', cursor: (loading || formInvalide) ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Traitement en cours...' : 'Confirmer et soumettre le versement'}
        </button>
      </form>
      {message && <p style={{ marginTop: '15px', padding: '10px', borderRadius: '6px', backgroundColor: '#f8f9fa', textAlign: 'center', fontWeight: '700', fontSize: '14px', color: message.startsWith('❌') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
}
