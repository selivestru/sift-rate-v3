import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '~/common/ui/Button'
import { PasswordField } from '~/modules/auth/components/PasswordField'

import { changePasswordSchema, type ChangePasswordInput } from '../schema/settings.schema'
import { mockDelay } from '../utils/mock-delay'
import { SettingsSection } from './SettingsSection'

export const ChangePasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<ChangePasswordInput>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  })

  const onSubmit = handleSubmit(async () => {
    setIsLoading(true)
    try {
      await mockDelay()
      toast.success('Password update saved (demo only)')
      reset()
    } finally {
      setIsLoading(false)
    }
  })

  return (
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
  )
}
