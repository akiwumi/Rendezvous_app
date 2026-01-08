import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * ProtectedRoute component that redirects unauthenticated users to login
 * and authenticated users away from login/register pages
 */
const ProtectedRoute = ({ children, redirectTo }: ProtectedRouteProps) => {
  const { currentUser, loading } = useApp();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // If user is logged in and trying to access login/register, redirect to feed
  if (currentUser && (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/')) {
    return <Navigate to="/feed" replace />;
  }

  // If no redirect specified and user not logged in, show children (for public routes)
  if (!redirectTo) {
    return <>{children}</>;
  }

  // For protected routes, redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

