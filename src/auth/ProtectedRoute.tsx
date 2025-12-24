import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { extractRolesFromClaims, extractRolesFromUser } from './roleUtils';


interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, getIdTokenClaims, user } = useAuth0();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let mounted = true;
    const checkRole = async () => {
      if (!requiredRole) {
        if (mounted) {
          setAuthorized(true);
          setChecking(false);
        }
        return;
      }
      try {
        const claims = await getIdTokenClaims();
        const roles = extractRolesFromClaims(claims) || extractRolesFromUser(user);
        const ok = roles?.some(r => r.toLowerCase() === requiredRole.toLowerCase()) ?? false;
        if (mounted) {
          setAuthorized(ok);
          setChecking(false);
        }
      } catch (err) {
        console.error('Role check failed:', err);
        if (mounted) {
          setAuthorized(false);
          setChecking(false);
        }
      }
    };

    if (isAuthenticated) checkRole();
    else {
      setChecking(false);
      setAuthorized(false);
    }

    return () => {
      mounted = false;
    };
  }, [requiredRole, isAuthenticated, getIdTokenClaims, user]);

  if (isLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && !authorized) {
    // authenticated but not authorized for this role → send to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
