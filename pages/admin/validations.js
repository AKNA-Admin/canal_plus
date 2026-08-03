import { useState } from 'react';

export default function AdminValidations() {
  const [demandes, setDemandes] = useState([
    { id: 1, nom_pdv: "PDV Abidjan Plateau", montant: 50000, preuve_recu_url: "https://wikimedia.org" }
  ]);
  const [msg, setMsg] = useState('');

  const traiterAction = (id, statut) => {
    setMsg(`✅ Demande ${id} enregistrée comme : ${statut}`);
    setDemandes(demandes.filter(d => d.id !== id));
  };

  return (
    <div style={{ padding: '2px', maxWidth: '420px', margin: '0 auto', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2 style={{ fontWeight: '800', fontSize: '18px', marginBottom: '20px' }}>🛡️ VALIDATION DES RECHARGES</h2>
      {msg && <p style={{ color: 'green', fontWeight: '700', textAlign: 'center' }}>{msg}</p>}
      
      {demandes.length === 0 ? (
        <p style={{ fontStyle: 'italic', textAlign: 'center' }}>Aucun versement en attente.</p>
      ) : (
        demandes.map(d => (
          <div key={d.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: '#fff', marginBottom: '15px' }}>
            <h3 style={{ margin: '0 0 5px 0', fontWeight: '700', fontSize: '16px' }}>{d.nom_pdv}</h3>
            <h2 style={{ margin: '0 0 10px 0', color: '#0056b3', fontWeight: '800', fontSize: '20px' }}>{d.montant.toLocaleString()} F CFA</h2>
            <a href={d.preuve_recu_url} target="_blank" rel="noreferrer" style={{ display: 'block', color: '#0070f3', fontSize: '13px', fontWeight: '700', marginBottom: '15px' }}>Cliquer pour voir le reçu bancaire</a>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => traiterAction(d.id, 'Approuvée')} style={{ flex: 1, height: '40px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: '700', cursor: 'pointer' }}>Valider</button>
              <button onClick={() => traiterAction(d.id, 'Rejetée')} style={{ flex: 1, height: '40px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: '700', cursor: 'pointer' }}>Rejeter</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
