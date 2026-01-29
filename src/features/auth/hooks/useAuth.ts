import { useNavigate } from 'react-router';

import { useAuthStore } from '../../../store/auth/useAuthStore';
import { authApi } from '../api/authApi';

export const useAuth = () => {
  const { accessToken, logout: clearStore } = useAuthStore();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('로그아웃 에러');
    } finally {
      clearStore();
      navigate('/login');
    }
  };

  return { isLoggedIn: !!accessToken, logout };
};
