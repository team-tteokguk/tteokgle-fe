import axios from 'axios';

import { useAuthStore } from '../store/auth/useAuthStore';

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

let refreshPromise: null | Promise<void> = null;

instance.interceptors.request.use(
  (config) => {
    // 백엔드가 HttpOnly 쿠키 기반 인증을 사용하므로 Authorization 헤더를 강제로 주입하지 않는다.
    // (SSE/REST 인증 주체 불일치 방지)
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const requestUrl = originalRequest?.url ?? '';
    const isAuthLoginRequest = requestUrl.includes('/auth/login');
    const isRefreshRequest = requestUrl.includes('/auth/refresh');

    if (error.response?.status === 401 && isRefreshRequest) {
      useAuthStore.getState().clearAuth();
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && isAuthLoginRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(
              `${instance.defaults.baseURL}/auth/refresh`,
              {},
              {
                withCredentials: true,
              },
            )
            .then(() => undefined)
            .finally(() => {
              refreshPromise = null;
            });
        }

        await refreshPromise;
        const { setAuthenticated } = useAuthStore.getState();
        setAuthenticated(true);
        return instance(originalRequest);
      } catch (refreshError) {
        console.error('세션이 만료되었습니다. 다시 로그인해주세요.');

        useAuthStore.getState().clearAuth();

        if (window.location.pathname !== '/login') {
          window.location.replace('/login');
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
