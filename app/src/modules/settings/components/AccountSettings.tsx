import { PageHeader } from '~/common/ui/PageHeader'
import { AUTH_METHOD, useAuthStore } from '~/modules/auth'

import { accountNavItem } from '../constants/settings-nav'
import { AccountPrivacySection } from './AccountPrivacySection'
import { ChangeDisplayNameForm } from './ChangeDisplayNameForm'
import { ChangeEmailForm } from './ChangeEmailForm'
import { ChangePasswordForm } from './ChangePasswordForm'
import { ChangeUsernameForm } from './ChangeUsernameForm'

export const AccountSettings = () => {
  const authMethod = useAuthStore((state) => state.user?.method)

  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6">
      <PageHeader
        icon={accountNavItem.icon}
        label="Settings"
        title={accountNavItem.label}
        description="Update sign-in details for your personal archive."
      />

      <div className="flex flex-col gap-4 sm:gap-5">
        <ChangeDisplayNameForm />
        <ChangeUsernameForm />
        {authMethod == AUTH_METHOD.CREDENTIALS && (
          <>
            <ChangeEmailForm />
            <ChangePasswordForm />
          </>
        )}
        <AccountPrivacySection />
      </div>
    </div>
  )
}
