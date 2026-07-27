import z from 'zod'
import { create } from 'zustand'

import { getStorageItem } from '~/common/utils/storage'

import type { User } from '../types/user.type'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthActions {
  setUser: (user: AuthState['user']) => void
  setIsLoading: (isLoading: boolean) => void
  setUsername: (username: string) => void
}

type Store = AuthState & AuthActions

export const useAuthStore = create<Store>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: getStorageItem('has_session', z.boolean(), false),

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setUsername: (username) => set({ user: { ...get().user!, username } }),
}))
