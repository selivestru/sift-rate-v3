import { useMutation } from '@tanstack/react-query'

import { authApi } from '../api/auth.api'

export const useLoginMutation = () => {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: authApi.login,
  })
}
