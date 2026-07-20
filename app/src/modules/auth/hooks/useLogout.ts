import { useMutation } from '@tanstack/react-query'
import { useLocation, useNavigate } from '@tanstack/react-router'

import { removeStorageItem } from '~/common/utils/storage'

import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'

export const useLogout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const setUser = useAuthStore((state) => state.setUser)

  const mutation = useMutation({
    mutationKey: ['logout'],
    mutationFn: authApi.logout,
    onMutate: () => {
      if (location.pathname.startsWith('/library') || location.pathname.startsWith('/life')) {
        navigate({ to: '/' })
      }

      setUser(null)

      removeStorageItem('has_session')
    },
  })

  const logout = () => mutation.mutate()

  return {
    logout,
  }
}
