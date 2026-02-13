import { create } from 'zustand';

interface AuthState {
  accessToken: null | string;
  clearAuth: () => void;
  isAuthenticated: boolean;
  setAccessToken: (token: null | string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  clearAuth: () =>
    set({
      accessToken: null,
      isAuthenticated: false,
    }),

  isAuthenticated: false,

  setAccessToken: (token) =>
    set({
      accessToken: token,
      isAuthenticated: !!token,
    }),
}));
