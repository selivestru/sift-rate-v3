import { useRef } from 'react'
import { useIntlayer } from 'react-intlayer'
import { Image } from 'reicon-react'

import { Alert, AlertDescription } from '~/common/ui/Alert'
import { Avatar, AvatarFallback, AvatarImage } from '~/common/ui/Avatar'
import { Button } from '~/common/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/common/ui/Dialog'
import { cn } from '~/common/utils/cn'
import { getFirstLetter } from '~/common/utils/getFirstLetter'
import { useAuthStore } from '~/modules/auth'
import { useChangeAvatarForm } from '~/modules/user'

import { SettingsSection } from './SettingsSection'

export const ChangeAvatarForm = () => {
  const content = useIntlayer('change-avatar-form')
  const shared = useIntlayer('shared')
  const avatarUrl = useAuthStore((state) => state.user?.avatarUrl)
  const username = useAuthStore((state) => state.user?.username)
  const displayName = useAuthStore((state) => state.user?.displayName)

  const {
    previewUrl,
    error,
    serverError,
    onFileChange,
    onSubmit,
    onClear,
    isLoading,
    isPreviewing,
  } = useChangeAvatarForm()

  const inputRef = useRef<HTMLInputElement>(null)

  const fallbackName = displayName ?? username

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    void onFileChange(event.target.files)
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

        <div className="flex min-w-0 flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            startIcon={<Image />}
            onClick={() => inputRef.current?.click()}
            isLoading={isPreviewing}
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

      <Dialog
        open={previewUrl !== null}
        onOpenChange={(next) => {
          if (!next && !isLoading) onClear()
        }}
      >
        <DialogContent className={cn('sm:max-w-[360px]', isLoading && 'pointer-events-none')}>
          <DialogHeader>
            <DialogTitle>{content.previewTitle}</DialogTitle>
            <DialogDescription>{content.previewDescription}</DialogDescription>
          </DialogHeader>

          <div className="flex justify-center">
            <Avatar className="ring-border size-[300px] ring-2 ring-offset-2 ring-offset-transparent">
              <AvatarImage src={previewUrl ?? undefined} alt={content.newAvatarPreview.value} />
              <AvatarFallback className="text-5xl">{getFirstLetter(fallbackName)}</AvatarFallback>
            </Avatar>
          </div>

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={onClear} isDisabled={isLoading}>
              {shared.cancel}
            </Button>
            <Button onClick={() => void onSubmit()} isLoading={isLoading}>
              {content.saveAvatar}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsSection>
  )
}
