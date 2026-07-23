import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '~/common/ui/Button'
import { useAuthStore } from '~/modules/auth'

import { changeUsernameSchema, type ChangeUsernameInput } from '../schema/settings.schema'
import { mockDelay } from '../utils/mock-delay'
import { SettingsSection } from './SettingsSection'
import { SettingsTextField } from './SettingsTextField'

export const ChangeUsernameForm = () => {
  const user = useAuthStore((state) => state.user)
  const currentUsername = user?.username ?? 'username'
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<ChangeUsernameInput>({
    defaultValues: { username: '' },
    resolver: zodResolver(changeUsernameSchema),
    mode: 'onChange',
  })

  const onSubmit = handleSubmit(async () => {
    setIsLoading(true)
    try {
      await mockDelay()
      toast.success('Username update saved (demo only)')
      reset()
    } finally {
      setIsLoading(false)
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate>
      <SettingsSection
        title="Username"
        description="Your public handle on SiftRate. Letters, numbers, and underscores only."
        footer={
          <Button type="submit" size="sm" isLoading={isLoading} isDisabled={!isValid || !isDirty}>
            Save username
          </Button>
        }
      >
        <SettingsTextField
          label="Current username"
          value={currentUsername}
          readOnly
          disabled
          autoComplete="username"
        />
        <SettingsTextField
          label="New username"
          autoComplete="username"
          placeholder="new_username"
          error={errors.username}
          {...register('username')}
        />
      </SettingsSection>
    </form>
  )
}
