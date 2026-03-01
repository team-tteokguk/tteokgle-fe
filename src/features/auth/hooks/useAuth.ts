import { useNavigate } from 'react-router';

import { useAuthStore } from '../../../store/auth/useAuthStore';
import { authApi } from '../api/authApi';

const AUTH_REFRESH_ELIGIBLE_KEY = 'auth-refresh-eligible';

export const useAuth = () => {
  const { accessToken, clearAuth, isAuthenticated, setAccessToken } = useAuthStore();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (_error) {
      console.error('로그아웃 에러');
    } finally {
      localStorage.removeItem(AUTH_REFRESH_ELIGIBLE_KEY);
      clearAuth();
      navigate('/login');
    }
  };

  return {
    accessToken,
    isLoggedIn: isAuthenticated,
    logout,
    setAccessToken,
  };
};
