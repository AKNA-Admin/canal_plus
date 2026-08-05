import { rustApi } from '@/lib/api';

const handleVente = async (data) => {
  try {
    const res = await rustApi.post('/api/vente', data);
    alert(`Vente OK! Commission: ${res.data.commission_calculee} f CFA`);
  } catch (e) {
    alert(e.response.data); // "Crédit insuffisant"
  }
}
