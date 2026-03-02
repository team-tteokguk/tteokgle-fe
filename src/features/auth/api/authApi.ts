import { instance } from '../../../services/axios';

export const authApi = {
  // 로그아웃
  logout: async (): Promise<void> => {
    await instance.post('/logout');
  },
};
