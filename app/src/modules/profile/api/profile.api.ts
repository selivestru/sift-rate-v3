import { api } from '~/common/api'

import type { ProfileResponse } from '../types/profile.types'

export const profileApi = {
  // getProfile: async (username: string) => {
  //   const response = await fetch(`/api/profile/${username}`)
  //   return await response.json()
  // },
  getProfile: (username: string) => {
    return api.get<ProfileResponse>(`/user/${username}`).json()
  },
}
