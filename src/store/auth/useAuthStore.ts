import { create } from 'zustand';

interface AuthState {
  accessToken: null | string;
  clearAuth: () => void;
  isAuthenticated: boolean;
  isAuthResolved: boolean;
  logout: () => void;
  setAccessToken: (token: null | string) => void;
  setAuthenticated: (value: boolean) => void;
  setAuthResolved: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  clearAuth: () =>
    set({
      accessToken: null,
      isAuthenticated: false,
      isAuthResolved: true,
    }),

  isAuthenticated: false,
  isAuthResolved: false,

  logout: () =>
    set({
      accessToken: null,
      isAuthenticated: false,
      isAuthResolved: true,
    }),

  setAccessToken: (token) =>
    set({
      accessToken: token,
      isAuthenticated: !!token,
      isAuthResolved: true,
    }),

  setAuthenticated: (value) =>
    set((state) => ({
      accessToken: value ? state.accessToken : null,
      isAuthenticated: value,
      isAuthResolved: true,
    })),

  setAuthResolved: (value) =>
    set({
      isAuthResolved: value,
    }),
}));
