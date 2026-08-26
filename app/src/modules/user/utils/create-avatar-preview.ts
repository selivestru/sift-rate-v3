import { getLocalizedContent } from '~/common/i18n'

export const createSquareCoverPreviewUrl = async (file: File, size = 300): Promise<string> => {
  const previewError = getLocalizedContent('user-change-avatar-form').previewError
  let bitmap: ImageBitmap

  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    throw new Error(previewError)
  }

  try {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size

    const context = canvas.getContext('2d')
    if (!context) throw new Error(previewError)

    const scale = Math.max(size / bitmap.width, size / bitmap.height)
    const width = bitmap.width * scale
    const height = bitmap.height * scale
    context.drawImage(bitmap, (size - width) / 2, (size - height) / 2, width, height)

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp'))
    if (!blob) throw new Error(previewError)

    return URL.createObjectURL(blob)
  } finally {
    bitmap.close()
  }
}
