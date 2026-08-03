import { useState } from 'react';
import Link from 'next/link';

export default function MyApp({ Component, pageProps }) {
  const [menuOuvert, setMenuOuvert] = useState(false);

  // Liste propre des liens internes
  const liensNavigation = [
    { label: "📝 Nouvelle Opération (Ventes)", url: "/" },
    { label: "📊 Tableau de Bord (Stocks)", url: "/dashboard" },
    { label: "💰 Versement en banque", url: "/recharge" },
    { label: "🛡️ Validation des Recharges", url: "/admin/validations" },
    { label: "👥 Relance", url: "/clients" }

  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f9', margin: 0, fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* BARRE DE NAVIGATION EN GRAS */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#000', 
        color: '#fff', 
        padding: '0 20px', 
        height: '60px',
        position: 'relative',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {/* Correction de fontSize pour un affichage stable */}
        <div style={{ fontWeight: '800', fontSize: '22px', letterSpacing: '0.5px' }}>
          CANAL+
        </div>

        {/* BOUTON DU MENU DÉROULANT */}
        <button 
          onClick={() => setMenuOuvert(!menuOuvert)}
          style={{ 
            backgroundColor: '#222', 
            color: '#fff', 
            border: '1px solid #444', 
            padding: '8px 16px', 
            borderRadius: '6px', 
            cursor: 'pointer', 
            fontWeight: '600',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {menuOuvert ? '🔙' : '☰'}
        </button>

        {/* LE MENU DÉROULANT (DROPDOWN) */}
        {menuOuvert && (
          <div style={{ 
            position: 'absolute', 
            top: '65px', 
            right: '20px', 
            backgroundColor: '#fff', 
            borderRadius: '8px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
            width: '310px', // Légèrement élargi pour que le numéro s'affiche sur une seule ligne
            zIndex: 1000,
            overflow: 'hidden',
            border: '1px solid #eee'
          }}>
            {/* Liens internes de l'application */}
            {liensNavigation.map((lien, index) => (
              <Link key={index} href={lien.url} passHref legacyBehavior>
                <a 
                  onClick={() => setMenuOuvert(false)}
                  style={{ 
                    display: 'block', 
                    padding: '14px 18px', 
                    color: '#333', 
                    textDecoration: 'none', 
                    fontWeight: '600', 
                    fontSize: '14px',
                    borderBottom: '1px solid #f0f0f0',
                    transition: 'background-color 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
                >
                  {lien.label}
                </a>
              </Link>
            ))}

            {/* LIEN D'ASSISTANCE TÉLÉPHONIQUE SÉCURISÉ (Lancement de l'appel direct sans erreur 404) */}
            <a 
              href="tel:0767700072"
              onClick={() => setMenuOuvert(false)}
              style={{ 
                display: 'block', 
                padding: '14px 18px', 
                color: '#dc3545', // En rouge pour se démarquer
                textDecoration: 'none', 
                fontWeight: '700', 
                fontSize: '13px',
                backgroundColor: '#fff5f5',
                transition: 'background-color 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#ffebeb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#fff5f5'}
            >
              ☎️ Besoin d'assistance (08h à 16h)
            </a>
          </div>
        )}
      </nav>

      {/* ZONE D'AFFICHAGE DE LA PAGE EN COURS */}
      <main style={{ padding: '10px' }}>
        <Component {...pageProps} />
      </main>
    </div>
  );
}
