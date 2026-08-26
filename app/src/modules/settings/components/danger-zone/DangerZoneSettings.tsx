import { useIntlayer } from 'react-intlayer'
import { AlertTriangle } from 'reicon-react'

import { Alert, AlertDescription, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'
import { PageHeader } from '~/common/ui/PageHeader'

import { dangerZoneNavItem } from '../../constants/settings-nav'
import { SettingsSection } from '../SettingsSection'
import { DeleteAccountDialog } from './DeleteAccountDialog'

export const DangerZoneSettings = () => {
  const content = useIntlayer('danger-zone-settings')
  const shared = useIntlayer('shared')
  const settingsNav = useIntlayer('settings-nav')

  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6">
      <PageHeader
        icon={dangerZoneNavItem.icon}
        label={shared.settings.value}
        title={settingsNav.dangerZone.value}
        description={content.pageDescription.value}
      />

      <div className="flex flex-col gap-4 sm:gap-5">
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>{content.warningTitle}</AlertTitle>
          <AlertDescription>{content.warningDescription}</AlertDescription>
        </Alert>

        <SettingsSection
          title={content.deleteTitle.value}
          description={content.deleteDescription.value}
          tone="destructive"
          footer={
            <DeleteAccountDialog>
              {({ open }) => (
                <Button type="button" size="sm" variant="destructive" onClick={open}>
                  {content.deleteButton}
                </Button>
              )}
            </DeleteAccountDialog>
          }
        >
          <ul className="text-muted-foreground list-inside list-disc space-y-1.5 text-sm leading-relaxed">
            <li>{content.reviewsRemoved}</li>
            <li>{content.listsRemoved}</li>
            <li>{content.profileUnavailable}</li>
          </ul>
        </SettingsSection>
      </div>
    </div>
  )
}
