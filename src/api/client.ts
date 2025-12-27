import axios from 'axios';
import { getAccessTokenSilently, ensureAuthenticatedForApi } from '../auth/auth0-wrapper'; // helpers

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach token if available. Don't add an empty Authorization header when token is missing.
api.interceptors.request.use(async (config) => {
  const token = await getAccessTokenSilently();
  console.log("Retrieved Access Token:", token); // Debug log (remove in prod)
  if (token) {
    if (config.headers) {
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    } else {
      config.headers = { Authorization: `Bearer ${token}` } as any;
    }
  }
  return config;
});

// If an API response comes back 401 (unauthorized), trigger an interactive login so user can re-authenticate
// and obtain fresh tokens. Note: this will redirect the app to the Auth0 login flow.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      try {
        await ensureAuthenticatedForApi();
      } catch (e) {
        // ignore errors from the redirect helper
      }
    }
    return Promise.reject(error);
  }
);

export default api;