import { api } from '~/common/api'

import type { CompleteProfileInput } from '../schema/auth.schema'
import type { CompleteProfileResponse, MeResponse } from '../types/auth.type'

export const authApi = {
  completeProfile: (body: CompleteProfileInput) => {
    return api.put<CompleteProfileResponse>('/auth/complete-profile', { json: body }).json()
  },
  getGoogleUrl: () => {
    return api.get<{ url: string }>('/auth/google/url').json()
  },
  me: () => {
    return api.get<MeResponse>('/auth/me').json()
  },
  logout: () => {
    return api.post('/auth/logout')
  },
}
