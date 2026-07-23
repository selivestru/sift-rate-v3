import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Check, Copy, Qr, ShieldLock } from 'reicon-react'
import { toast } from 'sonner'

import { Alert, AlertDescription, AlertTitle } from '~/common/ui/Alert'
import { Badge } from '~/common/ui/Badge'
import { Button } from '~/common/ui/Button'
import { PageHeader } from '~/common/ui/PageHeader'

import { twoFactorNavItem } from '../constants/settings-nav'
import { twoFactorCodeSchema, type TwoFactorCodeInput } from '../schema/settings.schema'
import { mockDelay } from '../utils/mock-delay'
import { SettingsSection } from './SettingsSection'
import { SettingsTextField } from './SettingsTextField'

const MOCK_SECRET = 'JBSWY3DPEHPK3PXP'
const MOCK_RECOVERY_CODES = [
  'A7K2-9M4P',
  'Q3WX-8L1N',
  'R5TY-2H6J',
  'V9BC-4D0F',
  'G1HK-7M3S',
  'P8NZ-5Q2W',
  'L4XC-6V9B',
  'T2FJ-1R8K',
]

export const TwoFactorSettings = () => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<TwoFactorCodeInput>({
    defaultValues: { code: '' },
    resolver: zodResolver(twoFactorCodeSchema),
    mode: 'onChange',
  })

  const handleCopySecret = async () => {
    try {
      await navigator.clipboard.writeText(MOCK_SECRET)
      setCopied(true)
      toast.success('Secret key copied')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy secret key')
    }
  }

  const handleEnable = handleSubmit(async () => {
    setIsLoading(true)
    try {
      await mockDelay()
      setIsEnabled(true)
      reset()
      toast.success('Two-factor authentication enabled (demo only)')
    } finally {
      setIsLoading(false)
    }
  })

  const handleDisable = async () => {
    setIsLoading(true)
    try {
      await mockDelay()
      setIsEnabled(false)
      reset()
      toast.success('Two-factor authentication disabled (demo only)')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6">
      <PageHeader
        icon={twoFactorNavItem.icon}
        label="Settings"
        title="Two-factor authentication"
        description="Add an authenticator app step when signing in. UI scaffold only — no real TOTP."
      />

      <div className="flex flex-col gap-4 sm:gap-5">
        <SettingsSection
          title="Status"
          description="Whether 2FA is currently required for sign-in."
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="border-border bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-lg border">
                <ShieldLock className="size-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-sm font-medium">Authenticator app</p>
                <p className="text-muted-foreground text-sm">
                  {isEnabled ? 'Enabled on this account' : 'Not enabled yet'}
                </p>
              </div>
            </div>
            <Badge variant={isEnabled ? 'default' : 'outline'}>
              {isEnabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
        </SettingsSection>

        {!isEnabled && (
          <form onSubmit={handleEnable} noValidate className="flex flex-col gap-4 sm:gap-5">
            <SettingsSection
              title="Set up authenticator"
              description="Scan the QR code or enter the secret key in Google Authenticator or a similar app."
            >
              <div className="border-border bg-muted flex flex-col items-center gap-4 rounded-xl border p-6 sm:flex-row sm:items-start">
                <div
                  className="border-border bg-background text-muted-foreground flex size-36 shrink-0 flex-col items-center justify-center gap-2 rounded-lg border border-dashed"
                  aria-hidden
                >
                  <Qr className="size-10" strokeWidth={1.5} />
                  <span className="text-xs font-medium">QR placeholder</span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-3 text-center sm:text-left">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Mock QR code for layout only. In production this would encode your one-time
                    secret for the authenticator app.
                  </p>
                  <div className="flex flex-col gap-2">
                    <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                      Secret key
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="border-border bg-background flex-1 truncate rounded-md border px-3 py-2 font-mono text-sm tracking-wide">
                        {MOCK_SECRET}
                      </code>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        isIconOnly
                        aria-label={copied ? 'Copied' : 'Copy secret key'}
                        onClick={handleCopySecret}
                      >
                        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </SettingsSection>

            <SettingsSection
              title="Verify code"
              description="Enter a 6-digit code from your authenticator to confirm setup."
              footer={
                <Button type="submit" size="sm" isLoading={isLoading} isDisabled={!isValid}>
                  Enable 2FA
                </Button>
              }
            >
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
        )}

        {isEnabled && (
          <>
            <Alert>
              <ShieldLock />
              <AlertTitle>2FA is active</AlertTitle>
              <AlertDescription>
                Sign-in would require a one-time code from your authenticator app. This is a demo
                state only.
              </AlertDescription>
            </Alert>

            <SettingsSection
              title="Recovery codes"
              description="Store these codes somewhere safe. Each code can be used once if you lose access to your authenticator."
            >
              <ul className="border-border bg-muted grid grid-cols-1 gap-2 rounded-xl border p-4 sm:grid-cols-2">
                {MOCK_RECOVERY_CODES.map((code) => (
                  <li key={code}>
                    <code className="font-mono text-sm tracking-wide">{code}</code>
                  </li>
                ))}
              </ul>
            </SettingsSection>

            <SettingsSection
              title="Disable two-factor authentication"
              description="You can turn 2FA off at any time. Demo action only."
              footer={
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  isLoading={isLoading}
                  onClick={handleDisable}
                >
                  Disable 2FA
                </Button>
              }
            >
              <p className="text-muted-foreground text-sm leading-relaxed">
                Disabling 2FA reduces account protection. In this scaffold it only flips local UI
                state.
              </p>
            </SettingsSection>
          </>
        )}
      </div>
    </div>
  )
}
