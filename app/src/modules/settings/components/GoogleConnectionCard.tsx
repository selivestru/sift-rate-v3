import { useState } from 'react'
import { toast } from 'sonner'

import GoogleIcon from '~/common/assets/icons/google.svg?react'
import { Badge } from '~/common/ui/Badge'
import { Button } from '~/common/ui/Button'
import { AUTH_METHOD, useAuthStore } from '~/modules/auth'

import { mockDelay } from '../utils/mock-delay'
import { SettingsSection } from './SettingsSection'

export const GoogleConnectionCard = () => {
  const method = useAuthStore((state) => state.user?.method)

  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      await mockDelay()
      const next = !isConnected
      toast.success(next ? 'Google connected (demo only)' : 'Google disconnected (demo only)')
      setIsConnected(next)
    } finally {
      setIsLoading(false)
    }
  }

  if (method === AUTH_METHOD.GOOGLE) {
    return
  }

  return (
    <SettingsSection
      title="Google"
      description="Connect Google for a faster sign-in option. Demo toggle only — no OAuth."
      footer={
        <Button
          type="button"
          size="sm"
          variant={isConnected ? 'outline' : 'secondary'}
          isLoading={isLoading}
          startIcon={<GoogleIcon />}
          onClick={handleToggle}
        >
          {isConnected ? 'Disconnect Google' : 'Connect Google'}
        </Button>
      }
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="border-border bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg border">
            <GoogleIcon className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium">Google account</p>
            <p className="text-muted-foreground truncate text-sm">
              {isConnected ? 'Connected for sign-in' : 'Not connected'}
            </p>
          </div>
        </div>
        <Badge variant={isConnected ? 'default' : 'outline'}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>
    </SettingsSection>
  )
}
