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

let refreshPromise: null | Promise<string> = null;

const getAccessTokenFromRefreshResponse = (data: any): null | string => {
  return data?.accessToken ?? data?.access_token ?? data?.token ?? null;
};

instance.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
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
    const isRefreshRequest = requestUrl.includes('/auth/refresh');

    if (error.response?.status === 401 && isRefreshRequest) {
      useAuthStore.getState().clearAuth();
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
            .then(({ data }) => {
              const token = getAccessTokenFromRefreshResponse(data);
              if (!token) {
                throw new Error('Refresh succeeded but no access token was returned.');
              }
              return token;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newAccessToken = await refreshPromise;

        useAuthStore.getState().setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
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
