import { create } from 'zustand';

interface AuthState {
  accessToken: null | string;
  clearAuth: () => void;
  isAuthenticated: boolean;
  logout: () => void;
  setAccessToken: (token: null | string) => void;
  setAuthenticated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  clearAuth: () =>
    set({
      accessToken: null,
      isAuthenticated: false,
    }),

  isAuthenticated: false,

  logout: () =>
    set({
      accessToken: null,
      isAuthenticated: false,
    }),

  setAccessToken: (token) =>
    set({
      accessToken: token,
      isAuthenticated: !!token,
    }),

  setAuthenticated: (value) =>
    set((state) => ({
      accessToken: value ? state.accessToken : null,
      isAuthenticated: value,
    })),
}));
