import axios from 'axios';
import { getAccessTokenSilently } from '../auth/auth0-wrapper'; // or your existing helper

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessTokenSilently();
  if (token) {
    if (config.headers) {
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    } else {
      config.headers = { Authorization: `Bearer ${token}` } as any;
    }
  }
  return config;
});

export default api;