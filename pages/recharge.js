import { useState } from 'react';

export default function RechargeCompte() {
  const [montant, setMontant] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const pdvId = 1; // Simulation en attendant le système de connexion

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setMessage("❌ Veuillez téléverser la preuve de votre versement (Mobile Money).");
      return;
    }

    setLoading(true);
    setMessage('Téléversement du reçu et envoi de la demande...');

    try {
      // 1. Envoi de l'image directement sur Cloudinary (Format non-signé pour faire simple)
      // Note : Remplacer 'demo' par votre propre Cloud Name Cloudinary si besoin
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', 'ml_default'); // Preset standard Cloudinary

      const cloudinaryRes = await fetch(`https://cloudinary.com`, {
        method: 'POST',
        body: formData
      });
      const cloudinaryData = await cloudinaryRes.json();
      const imageUrl = cloudinaryData.secure_url;

      if (!imageUrl) {
        throw new Error("Impossible de stocker le reçu sur Cloudinary.");
      }

      // 2. Envoi des données textuelles à votre serveur Render
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/versements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdv_id: pdvId,
          montant: Number(montant),
          preuve_recu_url: imageUrl
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Reçu envoyé avec succès ! Un administrateur va vérifier votre versement pour valider votre crédit.");
        setMontant('');
        setImage(null);
      } else {
        setMessage(`❌ Erreur : ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Une erreur est survenue lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '500px', margin: '40px auto', fontFamily: 'Segoe UI, sans-serif', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '10px' }}>Recharger mon compte PDV</h2>
      <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '25px' }}>Saisissez votre versement Mobile Money (Wave, Orange, MTN)</p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: '600' }}>Montant versé (F CFA) :</label>
          <input type="number" value={montant} onChange={(e) => setMontant(e.target.value)} required placeholder="Ex: 50000" style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ fontWeight: '600' }}>Téléverser la preuve du versement (Capture d'écran ou Photo) :</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required style={{ width: '100%', marginTop: '8px' }} />
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#0056b3', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Traitement...' : 'Soumettre le reçu pour vérification'}
        </button>
      </form>

      {message && <p style={{ marginTop: '20px', padding: '10px', borderRadius: '4px', backgroundColor: '#f8f9fa', textAlign: 'center', fontWeight: '600', color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
}
