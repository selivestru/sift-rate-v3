import GoogleIcon from '~/common/assets/icons/google.svg?react'
import { env } from '~/common/constants/env'
import { Button } from '~/common/ui/Button'

export const GoogleAuthButton = () => {
  const handlePress = () => {
    window.location.assign(`${env.VITE_BASE_URL}/auth/google`)
  }

  return (
    <Button
      fullWidth
      type="button"
      variant="secondary"
      className="h-11"
      startIcon={<GoogleIcon />}
      onClick={handlePress}
    >
      Continue with Google
    </Button>
  )
}
