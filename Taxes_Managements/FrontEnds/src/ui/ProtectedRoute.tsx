import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useLogin } from './loginContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, requireAdmin }) => {
  const { user, isAuthenticated, isLoading } = useLogin();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, always redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If account is pending validation or rejected, force redirect to pending page
  if (user?.status === 'en attente' || user?.status === 'rejete') {
    return <Navigate to="/validation-pending" replace />;
  }

  // Pure role-based logic: "Autorité Locale" acts as the superuser
  if (user?.role === 'Autorité Locale') {
    return <Outlet />;
  }

  // Check for specialized admin-only pages
  if (requireAdmin && user?.role !== 'Autorité Locale') {
    // Redirect non-admins to their primary functional page
    if (user?.role === 'Agent de Collecte') {
      return <Navigate to="/collecte" replace />;
    }
    if (user?.role === 'Vendeur') {
      return <Navigate to="/vendeurs" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // Check for allowed roles on specific pages
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    // Redirect to the safest page for their specific role
    if (user.role === 'Agent de Collecte') {
      return <Navigate to="/collecte" replace />;
    }
    if (user.role === 'Vendeur') {
      return <Navigate to="/vendeurs" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
