import { useMutation } from '@tanstack/react-query'

import { authApi } from '../api/auth.api'

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationKey: ['forgot-password'],
    mutationFn: authApi.forgotPassword,
  })
}
