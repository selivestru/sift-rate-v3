import { XCircle } from 'reicon-react'

import { Alert, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'
import { PasswordField } from '~/common/ui/PasswordField'
import { TwoFactorDialog } from '~/common/ui/TwoFactorDialog'
import { useAuthStore } from '~/modules/auth'

import { useChangeEmailForm } from '../hooks/useChangeEmailForm'
import { SettingsSection } from './SettingsSection'
import { SettingsTextField } from './SettingsTextField'

export const ChangeEmailForm = () => {
  const currentEmail = useAuthStore((state) => state.user?.email)
  const { onSubmit, isLoading, register, errors, isDirty, isValid, serverError, twoFactorState } =
    useChangeEmailForm()

  return (
    <>
      <form onSubmit={onSubmit} noValidate>
        <SettingsSection
          title="Email"
          description="Update the address we use for account notices. You'll confirm the change from your new inbox."
          footer={
            <Button type="submit" size="sm" isLoading={isLoading} isDisabled={!isValid || !isDirty}>
              Save email
            </Button>
          }
        >
          {serverError && (
            <Alert variant="destructive">
              <XCircle />
              <AlertTitle>{serverError}</AlertTitle>
            </Alert>
          )}

          <SettingsTextField
            label="Current email"
            value={currentEmail}
            readOnly
            disabled
            autoComplete="email"
          />
          <SettingsTextField
            label="New email"
            type="email"
            autoComplete="email"
            placeholder="new@example.com"
            error={errors.newEmail}
            {...register('newEmail')}
          />
          <PasswordField
            label="Current password"
            autoComplete="current-password"
            placeholder="Enter current password"
            error={errors.currentPassword}
            {...register('currentPassword')}
          />
        </SettingsSection>
      </form>

      <TwoFactorDialog
        isOpen={twoFactorState.isOpen}
        onClose={twoFactorState.onClose}
        onSubmit={twoFactorState.onSubmit}
        isLoading={twoFactorState.isLoading}
        error={twoFactorState.error}
      />
    </>
  )
}
