import { Navigate, Outlet, useLocation } from 'react-router'

import { useAuthStore } from '../../../store/auth/useAuthStore'

const ProtectedRoute = () => {
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  if (!user) {
    return <Navigate replace state={{ from: location }} to="/auth/signin" />
  }

  return <Outlet />
}

export default ProtectedRoute
