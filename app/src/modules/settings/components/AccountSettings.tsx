import { useIntlayer } from 'react-intlayer'

import { PageHeader } from '~/common/ui/PageHeader'

import { accountNavItem } from '../constants/settings-nav'
import { ChangeAvatarForm } from './ChangeAvatarForm'
import { ChangeDisplayNameForm } from './ChangeDisplayNameForm'
import { ChangeUsernameForm } from './ChangeUsernameForm'

export const AccountSettings = () => {
  const shared = useIntlayer('shared')
  const settingsNav = useIntlayer('settings-nav')

  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6">
      <PageHeader
        icon={accountNavItem.icon}
        label={shared.settings.value}
        title={settingsNav.account.value}
        description={settingsNav.accountDescription.value}
      />

      <div className="flex flex-col gap-4 sm:gap-5">
        <ChangeAvatarForm />
        <ChangeDisplayNameForm />
        <ChangeUsernameForm />
      </div>
    </div>
  )
}
