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
    cacheLocation: auth0Config.cacheLocation,
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
  } catch (err: any) {
    const msg = err?.message ?? err?.error ?? String(err);
    // If the SDK reports a missing refresh token, provide a clear actionable message.
    if (/missing refresh token/i.test(msg)) {
      console.error('Auth0: Missing Refresh Token — ensure `VITE_AUTH0_AUDIENCE` is set in your environment and that the user re-authenticates so a refresh token can be issued. Original error:', msg);
      // Don't automatically redirect from within API calls — return null so callers can decide to redirect.
      return null;
    }

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

/** Ensure a valid access token exists or redirect to login (interactive). */
export async function ensureAuthenticatedForApi(): Promise<string | null> {
  const token = await getAccessTokenSilently();
  if (token) return token;
  // Trigger an interactive login to obtain a fresh access token and refresh token.
  // This will redirect the browser to the Auth0 universal login flow.
  await loginWithRedirect({ authorizationParams: auth0Config.authorizationParams } as any);
  return null;
}

/** Optional: check if user is authenticated (quick) */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const client = await ensureClient();
    const token = await client.getTokenSilently();
    return Boolean(token && token.length > 0);
  } catch {
    return false;
  }
}