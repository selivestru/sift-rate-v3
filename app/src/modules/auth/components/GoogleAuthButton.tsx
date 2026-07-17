import { Button } from '@heroui/react'

import GoogleIcon from '~/assets/icons/google.svg?react'
import { env } from '~/common/constants/env'

export const GoogleAuthButton = () => {
  const handlePress = () => {
    window.location.assign(`${env.VITE_BASE_URL}/auth/google`)
  }

  return (
    <Button type="button" variant="secondary" fullWidth className="h-11" onPress={handlePress}>
      <GoogleIcon />
      Continue with Google
    </Button>
  )
}
