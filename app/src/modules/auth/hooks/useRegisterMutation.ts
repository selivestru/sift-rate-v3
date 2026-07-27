import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { setStorageItem } from '~/common/utils/storage'

import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'

export const useRegisterMutation = () => {
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate()

  return useMutation({
    mutationKey: ['register'],
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setUser(data.user)
      setStorageItem('has_session', true)
      navigate({ to: '/' })
    },
  })
}
