import { Navigate, Outlet, useLocation } from 'react-router';

import { useAuthStore } from '../../../store/auth/useAuthStore';

const ProtectedRoute = () => {
  const isAuthResolved = useAuthStore((state) => state.isAuthResolved);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthResolved) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
