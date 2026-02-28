import axios from 'axios';

import { useAuthStore } from '../../store/auth/useAuthStore';

export const api = axios.create({
  baseURL: import.meta.env.BASE_URL,
  withCredentials: true,
});

// Zustand에서 엑세스 토큰 꺼내 헤더에 붙임
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 엑세스 토큰 만료 시 리프레시 토큰을 통해 엑세스 토큰 발급 및 리프레시 토큰 요청
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 브라우저가 쿠키에서 리프레시 토큰을 꺼냄
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/refresh`,
          {},
          { withCredentials: true },
        );

        const accessToken = res.data?.accessToken ?? null;
        useAuthStore.getState().setAuthenticated(true);
        if (accessToken) {
          useAuthStore.getState().setAccessToken(accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // 리프레시 토큰 만료
        useAuthStore.getState().logout();
        alert('세션이 만료되었습니다. 다시 로그인 ㄱㄱ');
        window.location.href = '/auth/signin';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
