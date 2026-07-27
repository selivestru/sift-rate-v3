import { useState } from 'react'

import { toastApiError } from '~/common/api'
import GoogleIcon from '~/common/assets/icons/google.svg?react'
import { Button } from '~/common/ui/Button'

import { authApi } from '../api/auth.api'

export const GoogleAuthButton = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handlePress = async () => {
    setIsLoading(true)

    try {
      const { url } = await authApi.getGoogleUrl()
      window.location.assign(url)
    } catch (error) {
      setIsLoading(false)
      await toastApiError(error)
    }
  }

  return (
    <Button
      fullWidth
      type="button"
      variant="secondary"
      className="h-11"
      isLoading={isLoading}
      startIcon={<GoogleIcon />}
      onClick={handlePress}
    >
      Continue with Google
    </Button>
  )
}
