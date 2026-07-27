import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useAuthStore } from '~/modules/auth'

import { settingsApi } from '../api/settings.api'

export const useTwoFactorEnableMutation = () => {
  const setTwoFactor = useAuthStore((state) => state.setTwoFactor)

  return useMutation({
    mutationKey: ['two-factor-enable'],
    mutationFn: settingsApi.twoFactorEnable,
    onSuccess: (data) => {
      setTwoFactor(data.twoFactorEnabled)
      toast.success('Two-factor authentication enabled')
    },
  })
}
