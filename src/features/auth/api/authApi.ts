import type { TokenResponse } from '../types/index';

import axios from 'axios';

import { api } from '../../../shared/api/axiosInstance';

export const authApi = {
  // 로그아웃
  logout: async (): Promise<void> => {
    await api.post('/logout');
  },

  refresh: async (): Promise<TokenResponse> => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/refresh`,
      {},
      { withCredentials: true },
    );
    return response.data;
  },
};
