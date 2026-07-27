import { useMutation } from '@tanstack/react-query'

import { settingsApi } from '../api/settings.api'

export const useTwoFactorSetup = () => {
  return useMutation({
    mutationKey: ['two-factor-setup'],
    mutationFn: settingsApi.twoFactorSetup,
  })
}
