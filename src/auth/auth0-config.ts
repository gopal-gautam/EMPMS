export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || '',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || '',
  // Make cache location configurable (defaults to localstorage)
  cacheLocation: import.meta.env.VITE_AUTH0_CACHE_LOCATION || 'localstorage',
  authorizationParams: {
    redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL || window.location.origin,
    // Include audience and offline_access so Auth0 can issue a refresh token when requested
    audience: import.meta.env.VITE_AUTH0_AUDIENCE || undefined,
    scope: 'openid profile email offline_access',
  },
};
