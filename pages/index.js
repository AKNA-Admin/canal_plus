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

  // Calcul dynamique du montant selon vos règles métiers
  const calculerMontant = () => {
    let prixFormule = 0;
    if (formule === 'Access') prixFormule = 5000;
    if (formule === 'Evasion') prixFormule = 10000;
    if (formule === 'Access+') prixFormule = 15000;
    if (formule === 'Tout CANAL') prixFormule = 25000;

    if (typeVente === 'Reabonnement') return prixFormule;

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

  // Règles strictes de validation du formulaire
  const decodeurInvalide = numDecodeur.length !== 14 || isNaN(numDecodeur);
  const kitIncomplet = typeVente === 'Kit' && (!nomClient.trim() || !telClient.trim() || (estPromo && !prixMateriel));
  
  // Le formulaire n'est pas rempli correctement si le décodeur est invalide OU si le kit est incomplet
  const formulaireMalRempli = decodeurInvalide || kitIncomplet;

  const showDecodeurError = numDecodeur.length > 0 && numDecodeur.length !== 14;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Blocage de secours si la soumission passe quand même (ex: touche Entrée du clavier)
    if (formulaireMalRempli) {
      setMessage("❌ Erreur : Le formulaire n'est pas rempli correctement. Vérifiez toutes les cases.");
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

  const inputStyle = {
    width: '100%',
    height: '44px',
    padding: '0 12px',
    marginTop: '6px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    fontStyle: 'italic',
    fontSize: '15px'
  };

  const labelStyle = {
    fontWeight: '700',
    color: '#222',
    fontSize: '14px'
  };

  return (
    <div style={{ padding: '25px', maxWidth: '420px', margin: '30px auto', fontFamily: 'Segoe UI, sans-serif', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderRadius: '12px', backgroundColor: '#fff' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <img 
          src="https://wikimedia.org" 
          alt="Logo Canal+ PDV" 
          style={{ width: '100px', height: 'auto', display: 'block', margin: '0 auto' }} 
        />
      </div>

      <h2 style={{ textAlign: 'center', color: '#111', marginBottom: '20px', fontWeight: '800', fontSize: '20px' }}>Nouveau Contrat Canal+ CI</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Type d'opération :</label>
          <select value={typeVente} onChange={(e) => setTypeVente(e.target.value)} style={inputStyle}>
            <option value="Reabonnement">Réabonnement</option>
            <option value="Kit">Vente de Kit (Nouveau décodeur)</option>
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Formule Canal+ :</label>
          <select value={formule} onChange={(e) => setFormule(e.target.value)} style={inputStyle}>
            <option value="Access">Access (5 000 F)</option>
            <option value="Evasion">Évasion (10 000 F)</option>
            <option value="Access+">Access+ (15 000 F)</option>
            <option value="Tout CANAL">Tout CANAL (25 000 F)</option>
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>N° de Décodeur (14 chiffres) :</label>
          <input 
            type="text" 
            maxLength="14" 
            value={numDecodeur} 
            onChange={(e) => setNumDecodeur(e.target.value.replace(/\D/g, ''))}
            required 
            style={inputStyle} 
          />
          {showDecodeurError && (
            <p style={{ color: '#dc3545', fontSize: '12px', margin: '5px 0 0 0', fontWeight: '600', lineHeight: '1.4' }}>
              Le numéro du décodeur est incorrecte. Assurez vous de saisir les 14 chiffres du N° décodeur
            </p>
          )}
        </div>

        {typeVente === 'Kit' && (
          <div style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginBottom: '16px', borderLeft: '4px solid #000' }}>
            <h4 style={{ margin: '0 0 12px 0', fontWeight: '700' }}>Informations obligatoires du Kit</h4>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Nom & Prénoms du Client :</label>
              <input type="text" value={nomClient} onChange={(e) => setNomClient(e.target.value)} required style={inputStyle} />
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>N° Téléphone du Client :</label>
              <input type="tel" value={telClient} onChange={(e) => setTelClient(e.target.value)} required style={inputStyle} />
            </div>
            
            <div style={{ marginTop: '12px' }}>
              <label style={{ cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                <input type="checkbox" checked={estPromo} onChange={(e) => setEstPromo(e.target.checked)} style={{ marginRight: '8px', transform: 'scale(1.1)' }} />
                Kit en promotion ?
              </label>
            </div>
            
            {estPromo && (
              <div style={{ marginTop: '12px' }}>
                <label style={labelStyle}>Prix Matériel (F CFA) :</label>
                <input type="number" value={prixMateriel} onChange={(e) => setPrixMateriel(e.target.value)} required style={inputStyle} />
              </div>
            )}
          </div>
        )}

        <div style={{ margin: '20px 0', padding: '12px', backgroundColor: '#eef7ff', borderRadius: '8px', textAlign: 'center' }}>
          <span style={{ fontSize: '13px', color: '#555', fontWeight: '600' }}>Montant total à débiter :</span>
          <h3 style={{ margin: '3px 0 0 0', color: '#0056b3', fontSize: '22px', fontWeight: '800' }}>{montantTotal.toLocaleString()} F CFA</h3>
        </div>

        {/* Le bouton passe en couleur gris neutre (background #aaa) et interdit le clic s'il y a une erreur */}
        <button 
          type="submit" 
          disabled={loading || formulaireMalRempli} 
          style={{ 
            width: '100%', 
            height: '46px', 
            backgroundColor: formulaireMalRempli ? '#aaa' : '#000', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '6px', 
            fontWeight: '700', 
            fontSize: '15px', 
            cursor: (loading || formulaireMalRempli) ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s ease'
          }}
        >
          {loading ? 'Traitement...' : 'Enregistrer la vente'}
        </button>
      </form>

      {message && <p style={{ marginTop: '15px', padding: '10px', borderRadius: '6px', backgroundColor: '#f8f9fa', textAlign: 'center', fontWeight: '700', fontSize: '14px' }}>{message}</p>}
    </div>
  );
}
