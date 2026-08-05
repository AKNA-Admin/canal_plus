import axios from 'axios';

const rustApi = axios.create({
  baseURL: import.meta.env.VITE_RUST_API,
});

const javaApi = axios.create({
  baseURL: import.meta.env.VITE_JAVA_API,
});

// Intercepteur: Ajoute le token JWT à chaque requête
[rustApi, javaApi].forEach(api => {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
});

export { rustApi, javaApi };
