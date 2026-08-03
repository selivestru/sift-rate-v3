import { XCircle } from 'reicon-react'

import { Alert, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'
import { TwoFactorDialog } from '~/common/ui/TwoFactorDialog'
import { PasswordField } from '~/modules/auth/components/PasswordField'

import { useChangePasswordForm } from '../hooks/useChangePasswordForm'
import { SettingsSection } from './SettingsSection'

export const ChangePasswordForm = () => {
  const { onSubmit, isLoading, register, errors, isDirty, isValid, serverError, twoFactorState } =
    useChangePasswordForm()

  return (
    <>
      <form onSubmit={onSubmit} noValidate>
        <SettingsSection
          title="Password"
          description="Choose a strong password you do not use elsewhere."
          footer={
            <Button type="submit" size="sm" isLoading={isLoading} isDisabled={!isValid || !isDirty}>
              Save password
            </Button>
          }
        >
          {serverError && (
            <Alert variant="destructive">
              <XCircle />
              <AlertTitle>{serverError}</AlertTitle>
            </Alert>
          )}

          <PasswordField
            label="Current password"
            autoComplete="current-password"
            placeholder="Enter current password"
            error={errors.currentPassword}
            {...register('currentPassword')}
          />
          <PasswordField
            label="New password"
            autoComplete="new-password"
            placeholder="Enter new password"
            error={errors.newPassword}
            {...register('newPassword')}
          />
          <PasswordField
            label="Confirm new password"
            autoComplete="new-password"
            placeholder="Confirm new password"
            error={errors.confirmPassword}
            {...register('confirmPassword')}
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
