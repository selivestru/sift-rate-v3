import { useState } from 'react'
import Cropper, { type Area, type Point } from 'react-easy-crop'
import { useIntlayer } from 'react-intlayer'

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
import { Slider } from '~/common/ui/Slider'
import { cn } from '~/common/utils/cn'
import { getFirstLetter } from '~/common/utils/getFirstLetter'
import { cropAvatarImage } from '~/modules/user'

const MIN_ZOOM = 1
const MAX_ZOOM = 3
const ZOOM_STEP = 0.01

type AvatarEditorDialogProps = {
  stage: 'crop' | 'save'
  file: File
  imageUrl: string
  previewUrl: string | null
  fallbackName?: string | null
  isLoading: boolean
  serverError: string | null
  onConfirm: (file: File) => void
  onBack: () => void
  onClose: () => void
  onSave: () => Promise<void>
}

export const AvatarEditorDialog = ({
  stage,
  file,
  imageUrl,
  previewUrl,
  fallbackName,
  isLoading,
  serverError,
  onConfirm,
  onBack,
  onClose,
  onSave,
}: AvatarEditorDialogProps) => {
  const content = useIntlayer('avatar-editor-dialog')
  const shared = useIntlayer('shared')

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [cropError, setCropError] = useState<string | null>(null)
  const [isCropping, setIsCropping] = useState(false)

  const isSaving = stage === 'save'
  const isBusy = isCropping || isLoading

  const handleConfirm = async () => {
    if (!croppedAreaPixels || isBusy) return

    setIsCropping(true)
    setCropError(null)

    try {
      onConfirm(await cropAvatarImage(file, croppedAreaPixels))
    } catch {
      setCropError(content.cropError.value)
    } finally {
      setIsCropping(false)
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(next) => {
        if (!next && !isBusy) onClose()
      }}
    >
      <DialogContent className={cn('sm:max-w-90', isBusy && 'pointer-events-none')}>
        {isSaving ? (
          <>
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
              <Button variant="outline" onClick={onBack} isDisabled={isBusy}>
                {shared.back}
              </Button>
              <Button variant="outline" onClick={onClose} isDisabled={isBusy}>
                {shared.cancel}
              </Button>
              <Button onClick={() => void onSave()} isLoading={isLoading} isDisabled={isCropping}>
                {content.saveAvatar}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{content.title}</DialogTitle>
              <DialogDescription>{content.description}</DialogDescription>
            </DialogHeader>

            <div className="bg-muted relative mx-auto aspect-square w-full max-w-[300px] overflow-hidden rounded-xl">
              <Cropper
                image={imageUrl}
                crop={crop}
                zoom={zoom}
                minZoom={MIN_ZOOM}
                maxZoom={MAX_ZOOM}
                aspect={1}
                cropShape="round"
                showGrid={false}
                roundCropAreaPixels
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_croppedArea, pixels) => setCroppedAreaPixels(pixels)}
              />
            </div>

            <Slider
              value={zoom}
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={ZOOM_STEP}
              onValueChange={(value) => {
                setZoom(Array.isArray(value) ? (value[0] ?? MIN_ZOOM) : value)
              }}
              thumbAriaLabel={content.zoom.value}
              isDisabled={isBusy}
            />

            {cropError && (
              <Alert variant="destructive">
                <AlertDescription>{cropError}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={onClose} isDisabled={isBusy}>
                {shared.cancel}
              </Button>
              <Button
                onClick={() => void handleConfirm()}
                isLoading={isCropping}
                isDisabled={!croppedAreaPixels || isLoading}
              >
                {content.confirm}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
