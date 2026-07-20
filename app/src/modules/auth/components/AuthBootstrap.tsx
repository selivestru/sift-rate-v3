import { useEffect } from 'react'
import z from 'zod'

import { Spinner } from '~/common/ui/Spinner'
import { getStorageItem } from '~/common/utils/storage'

import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'

export const AuthBootstrap = ({ children }: { children: React.ReactNode }) => {
  const isLoading = useAuthStore((state) => state.isLoading)
  const setUser = useAuthStore((state) => state.setUser)
  const setIsLoading = useAuthStore((state) => state.setIsLoading)

  useEffect(() => {
    const handleAuth = async () => {
      const hasSession = getStorageItem('has_session', z.boolean(), false)

      if (!hasSession) {
        return
      }

      try {
        const response = await authApi.me()
        setUser(response.user)
      } catch (error) {
        console.debug('Error ', error)
      } finally {
        setIsLoading(false)
      }
    }

    handleAuth()
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) {
    return (
      <div className="bg-body flex min-h-dvh items-center justify-center">
        <Spinner className="text-primary size-8" />
      </div>
    )
  }

  return <>{children}</>
}
