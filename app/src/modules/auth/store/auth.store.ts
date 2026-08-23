import { z } from 'zod'
import { create } from 'zustand'

import { getStorageItem } from '~/common/utils/storage'

import type { CompleteProfileInput } from '../schema/auth.schema'
import type { User } from '../types/user.type'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthActions {
  setUser: (user: AuthState['user']) => void
  setCompleteProfile: (data: CompleteProfileInput) => void
  setIsLoading: (isLoading: boolean) => void
  setUsername: (username: string) => void
  setDisplayName: (displayName: string) => void
  setTwoFactor: (twoFactorEnabled: boolean) => void
  setIsPrivate: (isPrivate: boolean) => void
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
  setCompleteProfile: (data) => set({ user: { ...get().user!, ...data } }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setUsername: (username) => set({ user: { ...get().user!, username } }),
  setDisplayName: (displayName) => set({ user: { ...get().user!, displayName } }),
  setTwoFactor: (twoFactorEnabled) => set({ user: { ...get().user!, twoFactorEnabled } }),
  setIsPrivate: (isPrivate) => set({ user: { ...get().user!, isPrivate } }),
}))
