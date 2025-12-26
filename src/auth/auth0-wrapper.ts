// src/auth/auth0-wrapper.ts
// import type { Auth0Client, GetTokenSilentlyOptions } from '@auth0/auth0-spa-js';
// import createAuth0Client from '@auth0/auth0-spa-js';
import { createAuth0Client, type Auth0Client, type GetTokenSilentlyOptions } from '@auth0/auth0-spa-js';
import { auth0Config } from './auth0-config';

let auth0Client: Auth0Client | null = null;

/** Ensure the Auth0 client is created (lazy init). */
async function ensureClient() {
  if (auth0Client) return auth0Client;

  auth0Client = await createAuth0Client({
    domain: auth0Config.domain,
    clientId: auth0Config.clientId,
    authorizationParams: auth0Config.authorizationParams,
    // caching & refresh choices — adjust as needed:
    cacheLocation: 'memory', // 'localstorage' if you want persist across reloads
    useRefreshTokens: true,
  });

  return auth0Client;
}

/** Get an access token silently for API requests. Returns null on failure. */
export async function getAccessTokenSilently(opts?: GetTokenSilentlyOptions): Promise<string | null> {
  try {
    const client = await ensureClient();
    const token = await client.getTokenSilently(opts);
    return token ?? null;
  } catch (err) {
    // Optional: inspect err.error === 'login_required' to trigger login flow
    console.warn('getAccessTokenSilently failed:', err);
    return null;
  }
}

/** Convenience: initiate login redirect (optional). */
export async function loginWithRedirect(opts?: Record<string, unknown>) {
  const client = await ensureClient();
  return client.loginWithRedirect(opts);
}

/** Convenience: logout (optional). */
export async function logout(opts?: Parameters<Auth0Client['logout']>[0]) {
  const client = await ensureClient();
  return client.logout(opts as any);
}

/** Optional: check if user is authenticated (quick) */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const client = await ensureClient();
    return !!(await client.getTokenSilently()).length;
  } catch {
    return false;
  }
}