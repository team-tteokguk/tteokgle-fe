import { Navigate, Outlet, useLocation } from 'react-router';

import { useAuthStore } from '../../../store/auth/useAuthStore';

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/auth/signin" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
