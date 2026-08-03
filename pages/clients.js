import { useState, useEffect } from 'react';

export default function GestionClients() {
  const [recherche, setRecherche] = useState('');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger la liste des clients (Simulation de départ avant liaison API Render)
  useEffect(() => {
    // Liste de test basée sur vos besoins métiers
    setClients([
      { id: 1, nom_prenoms: "Koffi Kra Emmanuel", telephone: "0707070707", whatsapp: "2250707070707", num_decodeur: "14523698741235", num_abonne: "CPLUS-9921", date_echeance: "2026-08-07" }, // Expire dans 4 jours exacts par rapport au 3 août 2026
      { id: 2, nom_prenoms: "Awa Touré", telephone: "0505050505", whatsapp: "2250505050505", num_decodeur: "78451236985412", num_abonne: "CPLUS-4412", date_echeance: "2026-08-25" }
    ]);
  }, []);

  // Fonction pour vérifier si l'échéance est dans exactement 4 jours (Logique métier -4 jours)
  const estEcheanceProche = (dateString) => {
    if (!dateString) return false;
    const dateEcheance = new Date(dateString);
    const aujourdhui = new Date("2026-08-03"); // Date actuelle synchronisée
    
    // Calcul de la différence en jours
    const differenceTemps = dateEcheance.getTime() - aujourdhui.getTime();
    const differenceJours = Math.ceil(differenceTemps / (1000 * 3600 * 24));
    
    return differenceJours === 4;
  };

  // Filtrer la liste en temps réel selon la saisie de l'utilisateur
  const clients Filtres = clients.filter(c => 
    c.nom_prenoms.toLowerCase().includes(recherche.toLowerCase()) ||
    c.telephone.includes(recherche) ||
    c.num_decodeur.includes(recherche)
  );

  // Envoyer la notification automatique de relance sur WhatsApp Web/Application
  const envoyerRelanceWhatsApp = (client) => {
    const messageText = `Bonjour M./Mme ${client.nom_prenoms}, votre abonnement CANAL+ (Décodeur N° ${client.num_decodeur}) arrive à échéance le ${new Date(client.date_echeance).toLocaleDateString('fr-FR')}. Pensez à vous réabonner dès maintenant auprès de notre PDV pour éviter l'interruption de vos programmes préférés. Et profiter de votre semaine généreuse. Merci !`;
    
    // Ouvre une fenêtre WhatsApp officielle pré-remplie avec le numéro de Côte d'Ivoire
    const url = `https://whatsapp.com{client.whatsapp}&text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2 style={{ fontWeight: '800', marginBottom: '20px', borderBottom: '2px solid #333', paddingBottom: '10px' }}>
        👥 Base de Données & Recherche Clients
      </h2>

      {/* BARRE DE RECHERCHE UNIFORME */}
      <div style={{ marginBottom: '25px' }}>
        <label style={{ fontWeight: '700', fontSize: '14px' }}>Rechercher un client (Nom, Téléphone ou Décodeur) :</label>
        <input 
          type="text" 
          placeholder="Saisissez votre recherche..." 
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          style={{ width: '100%', height: '44px', padding: '0 12px', marginTop: '6px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontStyle: 'italic', fontSize: '15px' }}
        />
      </div>

      {/* TABLEAU DES CLIENTS */}
      <div style={{ overflowX: 'auto', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#000', color: '#fff', fontSize: '14px' }}>
              <th style={{ padding: '12px', fontWeight: '700' }}>Nom & Prénoms</th>
              <th style={{ padding: '12px', fontWeight: '700' }}>Téléphone</th>
              <th style={{ padding: '12px', fontWeight: '700' }}>N° Décodeur</th>
              <th style={{ padding: '12px', fontWeight: '700' }}>N° Abonné (Admin)</th>
              <th style={{ padding: '12px', fontWeight: '700' }}>Date d'échéance</th>
              <th style={{ padding: '12px', fontWeight: '700' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {clientsFiltres.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', fontStyle: 'italic' }}>Aucun client trouvé.</td>
              </tr>
            ) : (
              clientsFiltres.map((client) => {
                const alerteRelance = estEcheanceProche(client.date_echeance);
                return (
                  <tr key={client.id} style={{ borderBottom: '1px solid #eee', fontSize: '14px', backgroundColor: alerteRelance ? '#fff0f0' : '#fff' }}>
                    <td style={{ padding: '12px', fontWeight: '600' }}>{client.nom_prenoms}</td>
                    <td style={{ padding: '12px', fontStyle: 'italic' }}>{client.telephone}</td>
                    <td style={{ padding: '12px' }}>{client.num_decodeur}</td>
                    <td style={{ padding: '12px', color: client.num_abonne ? '#333' : '#999' }}>
                      {client.num_abonne || 'Non attribué'}
                    </td>
                    <td style={{ padding: '12px', fontWeight: '700', color: alerteRelance ? '#dc3545' : '#333' }}>
                      {client.date_echeance ? new Date(client.date_echeance).toLocaleDateString('fr-FR') : 'Inconnue'}
                      {alerteRelance && <span style={{ display: 'block', fontSize: '11px', color: '#dc3545', fontWeight: '800' }}>⚠️ ÉCHÉANCE J-4 !</span>}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button 
                        onClick={() => envoyerRelanceWhatsApp(client)}
                        style={{ 
                          backgroundColor: alerteRelance ? '#25D366' : '#6c757d', 
                          color: '#fff', 
                          border: 'none', 
                          padding: '6px 12px', 
                          borderRadius: '4px', 
                          fontWeight: '700', 
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        {alerteRelance ? '🟢 Relancer J-4 (WhatsApp)' : '💬 Contacter'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
