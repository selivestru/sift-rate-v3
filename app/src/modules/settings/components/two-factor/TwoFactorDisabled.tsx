import { QRCodeSVG } from 'qrcode.react'
import { XCircle } from 'reicon-react'

import { Alert, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'
import { CopyButton } from '~/common/ui/CopyButton'

import { useTwoFactorEnableForm } from '../../hooks/useTwoFactorEnableForm'
import type { TwoFactorSetupResponse } from '../../types/two-factor.types'
import { SettingsSection } from '../SettingsSection'
import { SettingsTextField } from '../SettingsTextField'

type TwoFactorDisabledProps = TwoFactorSetupResponse

export const TwoFactorDisabled = ({ otpauthUrl, secret }: TwoFactorDisabledProps) => {
  const {
    onSubmit,
    formState: { errors },
    register,
    isLoading,
    serverError,
  } = useTwoFactorEnableForm()

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 sm:gap-5">
      <SettingsSection
        title="Set up authenticator"
        description="Scan the QR code or enter the secret key in Google Authenticator or a similar app."
      >
        <div className="border-border bg-muted flex flex-col items-center gap-4 rounded-xl border p-6 sm:flex-row sm:items-start">
          <div
            className="border-border bg-background grid size-36 place-items-center gap-2 rounded-lg border border-dashed"
            aria-hidden
          >
            <QRCodeSVG title={`${secret} QR code`} value={otpauthUrl} size={128} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-3 text-center sm:text-left">
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Secret key
              </p>
              <div className="flex items-center gap-2">
                <code className="border-border bg-background flex-1 truncate rounded-md border px-3 py-2 font-mono text-sm tracking-wide">
                  {secret}
                </code>
                <CopyButton text={secret} />
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Verify code"
        description="Enter a 6-digit code from your authenticator to confirm setup."
        footer={
          <Button type="submit" size="sm" isLoading={isLoading}>
            Enable 2FA
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
