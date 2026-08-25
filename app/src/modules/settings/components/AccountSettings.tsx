import { PageHeader } from '~/common/ui/PageHeader'

import { accountNavItem } from '../constants/settings-nav'
import { ChangeDisplayNameForm } from './ChangeDisplayNameForm'
import { ChangeUsernameForm } from './ChangeUsernameForm'

export const AccountSettings = () => {
  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6">
      <PageHeader
        icon={accountNavItem.icon}
        label="Settings"
        title={accountNavItem.label}
        description="How you appear in your personal archive."
      />

      <div className="flex flex-col gap-4 sm:gap-5">
        <ChangeDisplayNameForm />
        <ChangeUsernameForm />
      </div>
    </div>
  )
}
