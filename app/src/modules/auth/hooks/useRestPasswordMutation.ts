import { useMutation } from '@tanstack/react-query'

import { authApi } from '../api/auth.api'

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationKey: ['reset-password'],
    mutationFn: authApi.resetPassword,
  })
}
