import { create } from 'zustand';

interface AuthState {
  clearAuth: () => void;
  isAuthenticated: boolean;
  isAuthResolved: boolean;
  logout: () => void;
  setAuthenticated: (value: boolean) => void;
  setAuthResolved: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  clearAuth: () =>
    set({
      isAuthenticated: false,
      isAuthResolved: true,
    }),

  isAuthenticated: false,
  isAuthResolved: false,

  logout: () =>
    set({
      isAuthenticated: false,
      isAuthResolved: true,
    }),

  setAuthenticated: (value) =>
    set({
      isAuthenticated: value,
      isAuthResolved: true,
    }),

  setAuthResolved: (value) =>
    set({
      isAuthResolved: value,
    }),
}));
