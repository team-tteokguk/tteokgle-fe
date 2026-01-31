import axios from 'axios';

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

instance.interceptors.request.use(
  (config) => {
    // 나중에 토큰 로직 넣을 곳
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 공통 에러 처리 (예: 401 인증 만료 처리 등)
    if (error.response?.status === 401) {
      // 리프레쉬 토큰
    }
    return Promise.reject(error);
  },
);
