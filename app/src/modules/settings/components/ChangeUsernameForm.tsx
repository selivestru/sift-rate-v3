import { useIntlayer } from 'react-intlayer'

import { Button } from '~/common/ui/Button'
import { useAuthStore } from '~/modules/auth'
import { useChangeUsernameForm } from '~/modules/user'

import { SettingsSection } from './SettingsSection'
import { SettingsTextField } from './SettingsTextField'

export const ChangeUsernameForm = () => {
  const content = useIntlayer('change-username-form')
  const currentUsername = useAuthStore((state) => state.user?.username)
  const { onSubmit, isLoading, register, errors, isDirty, isValid } = useChangeUsernameForm()

  return (
    <form onSubmit={onSubmit} noValidate>
      <SettingsSection
        title={content.title.value}
        description={content.description.value}
        footer={
          <Button type="submit" size="sm" isLoading={isLoading} isDisabled={!isValid || !isDirty}>
            {content.save}
          </Button>
        }
      >
        <SettingsTextField
          label={content.currentLabel.value}
          value={currentUsername!}
          readOnly
          disabled
          autoComplete="username"
        />
        <SettingsTextField
          label={content.newLabel.value}
          autoComplete="username"
          placeholder={content.newPlaceholder.value}
          error={errors.username}
          {...register('username')}
        />
      </SettingsSection>
    </form>
  )
}
