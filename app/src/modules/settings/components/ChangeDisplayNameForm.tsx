import { Button } from '~/common/ui/Button'
import { useAuthStore } from '~/modules/auth'
import { useChangeDisplayNameForm } from '~/modules/user'

import { SettingsSection } from './SettingsSection'
import { SettingsTextField } from './SettingsTextField'

export const ChangeDisplayNameForm = () => {
  const currentDisplayName = useAuthStore((state) => state.user?.displayName)
  const { onSubmit, isLoading, register, errors, isDirty, isValid } = useChangeDisplayNameForm()

  return (
    <form onSubmit={onSubmit} noValidate>
      <SettingsSection
        title="Display name"
        description="Your name shown across your personal archive. Between 2 and 50 characters."
        footer={
          <Button type="submit" size="sm" isLoading={isLoading} isDisabled={!isValid || !isDirty}>
            Save display name
          </Button>
        }
      >
        <SettingsTextField
          label="Current display name"
          value={currentDisplayName!}
          readOnly
          disabled
          autoComplete="name"
        />
        <SettingsTextField
          label="New display name"
          autoComplete="name"
          placeholder="New display name"
          error={errors.displayName}
          {...register('displayName')}
        />
      </SettingsSection>
    </form>
  )
}
