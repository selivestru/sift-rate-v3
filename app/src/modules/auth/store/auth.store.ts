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
  user: {
    // TODO: remove
    id: '1',
    email: 'sifmeop@gmail.com',
    username: 'sifmeop',
    avatarUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg',
    subscription: 'MONTHLY',
  },
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
