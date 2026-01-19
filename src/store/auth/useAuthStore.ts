import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  user: null | User
}

interface User {
  // TODO: 유저 타입 정의 수정
  email: string
  id: number
  name: string
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  login: (userData) => set({ isAuthenticated: true, user: userData }),

  logout: () => set({ isAuthenticated: false, user: null }),
  user: null,
}))
