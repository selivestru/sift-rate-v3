import { useMutation } from '@tanstack/react-query'

import { authApi } from '../api/auth.api'

export const useRegisterMutation = () => {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: authApi.register,
  })
}
