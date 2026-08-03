import { AlertTriangle } from 'reicon-react'

import { Alert, AlertDescription, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'
import { PageHeader } from '~/common/ui/PageHeader'

import { dangerZoneNavItem } from '../../constants/settings-nav'
import { SettingsSection } from '../SettingsSection'
import { DeleteAccountDialog } from './DeleteAccountDialog'

export const DangerZoneSettings = () => {
  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6">
      <PageHeader
        icon={dangerZoneNavItem.icon}
        label="Settings"
        title={dangerZoneNavItem.label}
        description="Irreversible account actions. Proceed carefully."
      />

      <div className="flex flex-col gap-4 sm:gap-5">
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>Deleting your account cannot be undone</AlertTitle>
          <AlertDescription>
            Your personal media archive, reviews, ranked lists, planned items, and profile would be
            permanently removed. Connected sign-in methods would stop working.
          </AlertDescription>
        </Alert>

        <SettingsSection
          title="Delete account"
          description="Permanently erase your SiftRate account and everything attached to it."
          tone="destructive"
          footer={
            <DeleteAccountDialog>
              {({ open }) => (
                <Button type="button" size="sm" variant="destructive" onClick={open}>
                  Delete account
                </Button>
              )}
            </DeleteAccountDialog>
          }
        >
          <ul className="text-muted-foreground list-inside list-disc space-y-1.5 text-sm leading-relaxed">
            <li>All reviews and ratings are removed</li>
            <li>Ranked lists and planned queue are removed</li>
            <li>Profile and username become unavailable</li>
          </ul>
        </SettingsSection>
      </div>
    </div>
  )
}
