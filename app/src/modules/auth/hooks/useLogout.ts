import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from '@tanstack/react-router'

import { removeStorageItem } from '~/common/utils/storage'

import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'

export const useLogout = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const setUser = useAuthStore((state) => state.setUser)

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationKey: ['logout'],
    mutationFn: authApi.logout,
    onMutate: () => {
      if (pathname.startsWith('/library') || pathname.startsWith('/settings')) {
        navigate({ to: '/' })
      }

      setUser(null)
      removeStorageItem('has_session')
      queryClient.clear()
    },
  })

  const logout = () => mutation.mutate()

  return {
    logout,
  }
}
