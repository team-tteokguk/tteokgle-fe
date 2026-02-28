import type { TokenResponse } from '../types/index';

import { instance } from '../../../services/axios';

export const authApi = {
  // 로그아웃
  logout: async (): Promise<void> => {
    await instance.post('/logout');
  },

  refresh: async (): Promise<TokenResponse> => {
    const response = await instance.post('/auth/refresh');
    return response.data;
  },
};
