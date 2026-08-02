import { useState } from 'react';

export default function FormulaireVente() {
  const [typeVente, setTypeVente] = useState('Reabonnement');
  const [formule, setFormule] = useState('Access');
  const [estPromo, setEstPromo] = useState(false);
  const [prixMateriel, setPrixMateriel] = useState('');
  const [numDecodeur, setNumDecodeur] = useState('');
  const [nomClient, setNomClient] = useState('');
  const [telClient, setTelClient] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Simulation des identifiants (En attendant la page de connexion)
  const pdvId = 1; 
  const userId = 1;

  // Calcul automatique du montant selon vos règles métiers
  const calculerMontant = () => {
    let prixFormule = 0;
    if (formule === 'Access') prixFormule = 5000;
    if (formule === 'Evasion') prixFormule = 10000;
    if (formule === 'Access+') prixFormule = 15000;
    if (formule === 'Tout CANAL') prixFormule = 25000;

    if (typeVente === 'Reabonnement') {
      return prixFormule;
    }

    // Logique pour les Ventes de Kits
    if (!estPromo) {
      if (formule === 'Access') return 25000;
      if (formule === 'Evasion') return 15000;
      if (formule === 'Tout CANAL') return 26000;
      return prixFormule;
    } else {
      return prixFormule + Number(prixMateriel || 0);
    }
  };

  const montantTotal = calculerMontant();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Vérification de la contrainte des 14 chiffres du décodeur
    if (numDecodeur.length !== 14 || isNaN(numDecodeur)) {
      setMessage("❌ Erreur : Le numéro de décodeur doit comporter exactement 14 chiffres.");
      return;
    }

    setLoading(true);
    setMessage('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(`${apiUrl}/api/ventes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type_vente: typeVente,
          formule,
          num_decodeur: numDecodeur,
          est_promo: estPromo,
          prix_materiel: estPromo ? Number(prixMateriel) : 0,
          nom_client: typeVente === 'Kit' ? nomClient : null,
          tel_client: typeVente === 'Kit' ? telClient : null,
          pdv_id: pdvId,
          user_id: userId
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ " + data.message);
        // Réinitialisation du formulaire
        setNumDecodeur('');
        setNomClient('');
        setTelClient('');
        setPrixMateriel('');
      } else {
        setMessage("❌ Erreur : " + (data.error || "Une erreur est survenue"));
      }
    } catch (error) {
      setMessage("❌ Erreur de connexion avec le serveur Render.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '500px', margin: '40px auto', fontFamily: 'Segoe UI, sans-serif', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: '#fff' }}>
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
  <img 
    src="https://res.cloudinary.com/zpy0qbjp/image/upload/v1785704386/Picture1_ekbv8d.png"
    alt="Logo Canal+ PDV" 
    style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }} 
   />
   </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: '600' }}>Type d'opération :</label>
          <select value={typeVente} onChange={(e) => setTypeVente(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}>
            <option value="Reabonnement">Réabonnement</option>
            <option value="Kit">Vente de Kit (Nouveau décodeur)</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: '600' }}>Formule Canal+ :</label>
          <select value={formule} onChange={(e) => setFormule(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}>
            <option value="Access">Access (5 000 F)</option>
            <option value="Evasion">Évasion (10 000 F)</option>
            <option value="Access+">Access+ (15 000 F)</option>
            <option value="Tout CANAL">Tout CANAL (25 000 F)</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: '600' }}>N° de Décodeur (14 chiffres) :</label>
          <input type="text" maxLength="14" value={numDecodeur} onChange={(e) => setNumDecodeur(e.target.value)} required style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>

        {typeVente === 'Kit' && (
          <div style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '6px', marginBottom: '15px', borderLeft: '4px solid #000' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Informations obligatoires du Kit</h4>
            <div style={{ marginBottom: '10px' }}>
              <label>Nom & Prénoms du Client :</label>
              <input type="text" value={nomClient} onChange={(e) => setNomClient(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>N° Téléphone du Client :</label>
              <input type="tel" value={telClient} onChange={(e) => setTelClient(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ marginTop: '10px' }}>
              <label style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                <input type="checkbox" checked={estPromo} onChange={(e) => setEstPromo(e.target.checked)} style={{ marginRight: '8px' }} />
                Kit en promotion ?
              </label>
            </div>
            {estPromo && (
              <div style={{ marginTop: '10px' }}>
                <label>Prix Matériel (F CFA) :</label>
                <input type="number" value={prixMateriel} onChange={(e) => setPrixMateriel(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
            )}
          </div>
        )}

        <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#eef7ff', borderRadius: '6px', textAlign: 'center' }}>
          <span style={{ fontSize: '14px', color: '#555' }}>Montant total à débiter du solde :</span>
          <h3 style={{ margin: '5px 0 0 0', color: '#0056b3', fontSize: '24px' }}>{montantTotal.toLocaleString()} F CFA</h3>
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Traitement en cours...' : 'Enregistrer et valider l\'opération'}
        </button>
      </form>

      {message && <p style={{ marginTop: '20px', padding: '10px', borderRadius: '4px', backgroundColor: '#f8f9fa', textAlign: 'center', fontWeight: '600' }}>{message}</p>}
    </div>
  );
}
