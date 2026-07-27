import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { setStorageItem } from '~/common/utils/storage'

import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'

export const useLoginMutation = () => {
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate()

  return useMutation({
    mutationKey: ['login'],
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setUser(data.user)
      setStorageItem('has_session', true)
      navigate({ to: '/' })
    },
  })
}
