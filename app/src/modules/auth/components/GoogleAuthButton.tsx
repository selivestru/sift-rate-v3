import { useState } from 'react'
import { useIntlayer } from 'react-intlayer'

import { toastApiError } from '~/common/api'
import GoogleIcon from '~/common/assets/icons/google.svg?react'
import { Button } from '~/common/ui/Button'

import { authApi } from '../api/auth.api'

type GoogleAuthButtonProps = Pick<
  React.ComponentProps<typeof Button>,
  'variant' | 'size' | 'fullWidth'
> & {
  label?: string
}

export const GoogleAuthButton = ({
  variant = 'secondary',
  size,
  fullWidth = true,
  label,
}: GoogleAuthButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const content = useIntlayer('google-auth-button')

  const handlePress = async () => {
    setIsLoading(true)

    try {
      const { url } = await authApi.getGoogleUrl()
      window.location.assign(url)
    } catch (error) {
      await toastApiError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      fullWidth={fullWidth}
      type="button"
      variant={variant}
      size={size}
      isLoading={isLoading}
      startIcon={<GoogleIcon />}
      onClick={handlePress}
    >
      {label ?? content.continueWithGoogle.value}
    </Button>
  )
}
