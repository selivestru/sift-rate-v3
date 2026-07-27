import { XCircle } from 'reicon-react'

import { Alert, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'

import { useTwoFactorDisableForm } from '../../hooks/useTwoFactorDisableForm'
import { SettingsSection } from '../SettingsSection'
import { SettingsTextField } from '../SettingsTextField'

export const TwoFactorEnabled = () => {
  const {
    onSubmit,
    formState: { errors },
    register,
    isLoading,
    serverError,
  } = useTwoFactorDisableForm()

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 sm:gap-5">
      <SettingsSection
        title="Disable two-factor authentication"
        description="You can turn 2FA off at any time."
        footer={
          <Button type="submit" size="sm" variant="destructive" isLoading={isLoading}>
            Disable 2FA
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
          label="Verification code"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="000000"
          maxLength={6}
          error={errors.code}
          {...register('code')}
        />
      </SettingsSection>
    </form>
  )
}
