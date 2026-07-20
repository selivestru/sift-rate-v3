import { create } from 'zustand'

import type { User } from '../types/user.type'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthActions {
  setUser: (user: AuthState['user']) => void
  setIsLoading: (isLoading: boolean) => void
}

type Store = AuthState & AuthActions

export const useAuthStore = create<Store>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}))
