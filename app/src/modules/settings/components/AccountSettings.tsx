import { PageHeader } from '~/common/ui/PageHeader'

import { accountNavItem } from '../constants/settings-nav'
import { ChangeEmailForm } from './ChangeEmailForm'
import { ChangePasswordForm } from './ChangePasswordForm'
import { ChangeUsernameForm } from './ChangeUsernameForm'
import { GoogleConnectionCard } from './GoogleConnectionCard'

export const AccountSettings = () => {
  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6">
      <PageHeader
        icon={accountNavItem.icon}
        label="Settings"
        title={accountNavItem.label}
        description="Update sign-in details for your personal archive. Changes stay local in this demo."
      />

      <div className="flex flex-col gap-4 sm:gap-5">
        <ChangeUsernameForm />
        <ChangeEmailForm />
        <ChangePasswordForm />
        <GoogleConnectionCard />
      </div>
    </div>
  )
}
