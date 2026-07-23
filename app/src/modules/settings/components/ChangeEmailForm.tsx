import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '~/common/ui/Button'
import { useAuthStore } from '~/modules/auth'

import { changeEmailSchema, type ChangeEmailInput } from '../schema/settings.schema'
import { mockDelay } from '../utils/mock-delay'
import { SettingsSection } from './SettingsSection'
import { SettingsTextField } from './SettingsTextField'

export const ChangeEmailForm = () => {
  const user = useAuthStore((state) => state.user)
  const currentEmail = user?.email ?? 'you@example.com'
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<ChangeEmailInput>({
    defaultValues: { email: '' },
    resolver: zodResolver(changeEmailSchema),
    mode: 'onChange',
  })

  const onSubmit = handleSubmit(async () => {
    setIsLoading(true)
    try {
      await mockDelay()
      toast.success('Email update saved (demo only)')
      reset()
    } finally {
      setIsLoading(false)
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate>
      <SettingsSection
        title="Email"
        description="Update the address we use for account notices."
        footer={
          <Button type="submit" size="sm" isLoading={isLoading} isDisabled={!isValid || !isDirty}>
            Save email
          </Button>
        }
      >
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
          error={errors.email}
          {...register('email')}
        />
      </SettingsSection>
    </form>
  )
}
