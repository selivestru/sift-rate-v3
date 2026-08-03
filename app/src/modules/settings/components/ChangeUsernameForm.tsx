import { Button } from '~/common/ui/Button'
import { useAuthStore } from '~/modules/auth'
import { useChangeUsernameForm } from '~/modules/user'

import { SettingsSection } from './SettingsSection'
import { SettingsTextField } from './SettingsTextField'

export const ChangeUsernameForm = () => {
  const currentUsername = useAuthStore((state) => state.user?.username)
  const { onSubmit, isLoading, register, errors, isDirty, isValid } = useChangeUsernameForm()

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
          value={currentUsername!}
          readOnly
          disabled
          autoComplete="username"
        />
        <SettingsTextField
          label="New username"
          autoComplete="username"
          placeholder="New username"
          error={errors.username}
          {...register('username')}
        />
      </SettingsSection>
    </form>
  )
}
