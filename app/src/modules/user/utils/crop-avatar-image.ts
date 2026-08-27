export type CropArea = {
  x: number
  y: number
  width: number
  height: number
}

const OUTPUT_SIZE = 300
const CROP_ERROR = 'Avatar crop failed'

export const cropAvatarImage = async (file: File, croppedArea: CropArea): Promise<File> => {
  let bitmap: ImageBitmap

  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    throw new Error(CROP_ERROR)
  }

  try {
    const canvas = document.createElement('canvas')
    canvas.width = OUTPUT_SIZE
    canvas.height = OUTPUT_SIZE

    const context = canvas.getContext('2d')
    if (!context) throw new Error(CROP_ERROR)

    const sourceX = Math.min(Math.max(0, croppedArea.x), bitmap.width)
    const sourceY = Math.min(Math.max(0, croppedArea.y), bitmap.height)
    const sourceWidth = Math.min(Math.max(1, croppedArea.width), bitmap.width - sourceX)
    const sourceHeight = Math.min(Math.max(1, croppedArea.height), bitmap.height - sourceY)

    context.drawImage(
      bitmap,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      OUTPUT_SIZE,
      OUTPUT_SIZE,
    )

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', 1),
    )
    if (!blob) throw new Error(CROP_ERROR)

    return new File([blob], 'avatar.webp', { type: 'image/webp' })
  } finally {
    bitmap.close()
  }
}
