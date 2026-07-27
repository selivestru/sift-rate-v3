import { useEffect } from 'react'
import { ShieldLock } from 'reicon-react'

import { Badge } from '~/common/ui/Badge'
import { Button } from '~/common/ui/Button'
import { PageHeader } from '~/common/ui/PageHeader'
import { Spinner } from '~/common/ui/Spinner'
import { useAuthStore } from '~/modules/auth'

import { twoFactorNavItem } from '../../constants/settings-nav'
import { useTwoFactorSetup } from '../../hooks/useTwoFactorSetup'
import { SettingsSection } from '../SettingsSection'
import { TwoFactorDisabled } from './TwoFactorDisabled'
import { TwoFactorEnabled } from './TwoFactorEnabled'

export const TwoFactorSettings = () => {
  const twoFactorEnabled = useAuthStore((state) => state.user?.twoFactorEnabled)

  const twoFactorSetup = useTwoFactorSetup()

  useEffect(() => {
    if (twoFactorEnabled) return

    void twoFactorSetup.mutate()
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [twoFactorEnabled])

  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6">
      <PageHeader
        icon={twoFactorNavItem.icon}
        label="Settings"
        title="Two-factor authentication"
        description="Add an authenticator app step when signing in."
      />

      <div className="flex flex-col gap-4 sm:gap-5">
        <SettingsSection
          title="Status"
          description="Whether 2FA is currently required for sign-in."
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="border-border bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-lg border">
                <ShieldLock className="size-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-sm font-medium">Authenticator app</p>
                <p className="text-muted-foreground text-sm">
                  {twoFactorEnabled ? 'Enabled on this account' : 'Not enabled yet'}
                </p>
              </div>
            </div>
            <Badge variant={twoFactorEnabled ? 'default' : 'outline'}>
              {twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
        </SettingsSection>

        {twoFactorSetup.isPending && <Spinner className="mx-auto size-10" />}

        {twoFactorSetup.isError && (
          <SettingsSection
            title="Error"
            tone="destructive"
            footer={
              <Button size="sm" onClick={() => twoFactorSetup.mutate()}>
                Try again
              </Button>
            }
          >
            <p className="text-muted-foreground text-sm leading-relaxed">
              Failed to load 2FA setup. Please try again.
            </p>
          </SettingsSection>
        )}

        {!twoFactorEnabled &&
          !twoFactorSetup.isPending &&
          !twoFactorSetup.isError &&
          twoFactorSetup.data && <TwoFactorDisabled {...twoFactorSetup.data} />}

        {twoFactorEnabled && <TwoFactorEnabled />}
      </div>
    </div>
  )
}
