import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RequireAuth() {
  const { user } = useAuth();

  return !user?.isAuthenticated ? <Navigate to="/login" replace /> : <Outlet />;
}

