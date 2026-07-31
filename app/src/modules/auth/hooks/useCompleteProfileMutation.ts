import { useMutation } from '@tanstack/react-query'

import { authApi } from '../api/auth.api'

export const useCompleteProfileMutation = () => {
  return useMutation({
    mutationKey: ['complete-profile'],
    mutationFn: authApi.completeProfile,
  })
}
