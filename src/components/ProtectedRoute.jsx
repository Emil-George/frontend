import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute component that handles authentication and authorization
 * Redirects unauthenticated users to login page
 * Optionally checks for specific roles
 */
function ProtectedRoute({ children, requiredRole = null, fallbackPath = '/login' }) {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check role-based access if required
  if (requiredRole && !hasRole(requiredRole)) {
    // Redirect based on user's actual role
    const redirectPath = user?.role === 'ADMIN' ? '/admin' : '/tenant';
    return (
      <Navigate 
        to={redirectPath} 
        replace 
      />
    );
  }

  // Render protected content
  return children;
}

/**
 * AdminRoute component - shorthand for admin-only routes
 */
export function AdminRoute({ children }) {
  return (
    <ProtectedRoute requiredRole="ADMIN" fallbackPath="/login">
      {children}
    </ProtectedRoute>
  );
}

/**
 * TenantRoute component - shorthand for tenant-only routes
 */
export function TenantRoute({ children }) {
  return (
    <ProtectedRoute requiredRole="TENANT" fallbackPath="/login">
      {children}
    </ProtectedRoute>
  );
}

/**
 * PublicRoute component - redirects authenticated users away from auth pages
 */
export function PublicRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    // Redirect authenticated users to their appropriate dashboard
    const redirectPath = user.role === 'ADMIN' ? '/admin' : '/tenant';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

/**
 * RoleBasedRoute component - renders different content based on user role
 */
export function RoleBasedRoute({ adminComponent, tenantComponent, fallback = null }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return fallback || <Navigate to="/login" replace />;
  }

  if (user?.role === 'ADMIN') {
    return adminComponent;
  }

  if (user?.role === 'TENANT') {
    return tenantComponent;
  }

  return fallback || <Navigate to="/login" replace />;
}

export default ProtectedRoute;
