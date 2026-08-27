import { useRef } from 'react'
import { useIntlayer } from 'react-intlayer'
import { Image } from 'reicon-react'

import { Alert, AlertDescription } from '~/common/ui/Alert'
import { Avatar, AvatarFallback, AvatarImage } from '~/common/ui/Avatar'
import { Button } from '~/common/ui/Button'
import { getFirstLetter } from '~/common/utils/getFirstLetter'
import { useAuthStore } from '~/modules/auth'
import { useChangeAvatarForm } from '~/modules/user'

import { AvatarEditorDialog } from './AvatarEditorDialog'
import { SettingsSection } from './SettingsSection'

export const ChangeAvatarForm = () => {
  const content = useIntlayer('change-avatar-form')
  const avatarUrl = useAuthStore((state) => state.user?.avatarUrl)
  const username = useAuthStore((state) => state.user?.username)
  const displayName = useAuthStore((state) => state.user?.displayName)

  const {
    stage,
    source,
    preview,
    error,
    serverError,
    onFileChange,
    onCropConfirm,
    onBackToCrop,
    onSubmit,
    onClear,
    isLoading,
  } = useChangeAvatarForm()

  const inputRef = useRef<HTMLInputElement>(null)

  const fallbackName = displayName ?? username

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(event.target.files)
    event.target.value = ''
  }

  return (
    <SettingsSection title={content.title.value} description={content.description.value}>
      <div className="flex items-center gap-4 sm:gap-5">
        <Avatar className="ring-border size-20 ring-2 ring-offset-2 ring-offset-transparent sm:size-24">
          <AvatarImage src={avatarUrl ?? undefined} alt={fallbackName ?? undefined} />
          <AvatarFallback className="text-xl sm:text-2xl">
            {getFirstLetter(fallbackName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            startIcon={<Image />}
            onClick={() => inputRef.current?.click()}
            isDisabled={isLoading}
          >
            {content.chooseImage}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            aria-label={content.chooseAvatarImage.value}
            onChange={handleFileChange}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {stage !== 'idle' && source && (
        <AvatarEditorDialog
          stage={stage}
          file={source.file}
          imageUrl={source.url}
          previewUrl={preview?.url ?? null}
          fallbackName={fallbackName}
          isLoading={isLoading}
          serverError={serverError}
          onConfirm={onCropConfirm}
          onBack={onBackToCrop}
          onClose={onClear}
          onSave={onSubmit}
        />
      )}
    </SettingsSection>
  )
}
