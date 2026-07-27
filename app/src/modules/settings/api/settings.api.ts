import { api } from '~/common/api'

import type { TwoFactorSetupResponse, TwoFactorToggleResponse } from '../types/two-factor.types'

export const settingsApi = {
  twoFactorSetup: () => {
    return api.post<TwoFactorSetupResponse>('2fa/setup').json()
  },
  twoFactorEnable: (code: string) => {
    return api.post<TwoFactorToggleResponse>('2fa/verify', { json: { code } }).json()
  },
  twoFactorDisable: (code: string) => {
    return api.post<TwoFactorToggleResponse>('2fa/disable', { json: { code } }).json()
  },
}
