import { useEffect } from 'react';

export const useWebSocket = (onNewVente: (data: any) => void) => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    const ws = new WebSocket(
      `${import.meta.env.VITE_RUST_API.replace('https', 'wss')}/ws`,
      [token] // on passe le token dans le protocole
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'NEW_VENTE') {
        onNewVente(data); // Affiche toast notif
      }
    };
    return () => ws.close();
  }, []);
}
