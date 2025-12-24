// src/auth/roleUtils.ts
export const extractRolesFromClaims = (claims?: Record<string, any>): string[] | undefined => {
  if (!claims) return undefined;
  if (Array.isArray(claims.roles)) return claims.roles;
  // look for any key containing "role"/"roles" (including namespaced claims)
  const key = Object.keys(claims).find(k => /roles?$/i.test(k) || /roles?/i.test(k));
  if (key && Array.isArray(claims[key])) return claims[key];
  // fallback: find any array value that looks like roles
  const arrKey = Object.keys(claims).find(k => Array.isArray(claims[k]) && /roles?/i.test(k));
  if (arrKey) return claims[arrKey];
  return undefined;
};

export const extractRolesFromUser = (user?: Record<string, any>): string[] | undefined =>
  extractRolesFromClaims(user);