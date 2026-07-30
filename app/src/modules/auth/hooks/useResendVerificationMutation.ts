import { useMutation } from '@tanstack/react-query'

import { authApi } from '../api/auth.api'

export const useResendVerificationMutation = () => {
  return useMutation({
    mutationKey: ['resend-verification'],
    mutationFn: authApi.resendVerification,
  })
}
