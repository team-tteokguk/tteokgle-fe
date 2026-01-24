import { create } from 'zustand';

interface AuthState {
  accessToken: null | string;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;

  logout: () => void;
  // 토큰 갱신
  setAccessToken: (token: string) => void;

  user: null | User;
}

interface User {
  // TODO: 유저 타입 정의 수정
  email: string;
  id: number;
  name: string;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  login: (userData, token) =>
    set({
      accessToken: token,
      isAuthenticated: true,
      user: userData,
    }),

  logout: () =>
    set({
      accessToken: null,
      isAuthenticated: false,
      user: null,
    }),

  setAccessToken: (token) => set({ accessToken: token }),

  user: null,
}));
