import { useIntlayer } from 'react-intlayer'

import { Button } from '~/common/ui/Button'
import { useAuthStore } from '~/modules/auth'
import { useChangeDisplayNameForm } from '~/modules/user'

import { SettingsSection } from './SettingsSection'
import { SettingsTextField } from './SettingsTextField'

export const ChangeDisplayNameForm = () => {
  const content = useIntlayer('change-display-name-form')
  const currentDisplayName = useAuthStore((state) => state.user?.displayName)
  const { onSubmit, isLoading, register, errors, isDirty, isValid } = useChangeDisplayNameForm()

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
          value={currentDisplayName!}
          readOnly
          disabled
          autoComplete="name"
        />
        <SettingsTextField
          label={content.newLabel.value}
          autoComplete="name"
          placeholder={content.newPlaceholder.value}
          error={errors.displayName}
          {...register('displayName')}
        />
      </SettingsSection>
    </form>
  )
}
