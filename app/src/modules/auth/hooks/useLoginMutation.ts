import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { setStorageItem } from '~/common/utils/storage'

import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'

export const useLoginMutation = () => {
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['login'],
    mutationFn: authApi.login,
    onSuccess: (data) => {
      queryClient.clear()
      setUser(data.user)
      setStorageItem('has_session', true)
      navigate({ to: '/' })
    },
  })
}
