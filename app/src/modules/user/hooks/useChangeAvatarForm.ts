import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { getApiError } from '~/common/api'
import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { useAuthStore } from '~/modules/auth'

import { createSquareCoverPreviewUrl } from '../utils/create-avatar-preview'
import { useChangeAvatarMutation } from './useChangeAvatarMutation'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024

export const useChangeAvatarForm = () => {
  const mutation = useChangeAvatarMutation()
  const queryClient = useQueryClient()
  const username = useAuthStore((state) => state.user?.username)
  const setAvatarUrl = useAuthStore((state) => state.setAvatarUrl)

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPreviewing, setIsPreviewing] = useState(false)

  const previewUrlRef = useRef<string | null>(null)

  const revokePreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
  }

  const clearSelection = () => {
    revokePreview()
    setPreviewUrl(null)
    setFile(null)
  }

  useEffect(() => {
    const url = previewUrlRef
    return () => {
      if (url.current) URL.revokeObjectURL(url.current)
    }
  }, [])

  const onFileChange = async (fileList: FileList | null) => {
    const selected = fileList?.[0]
    setError(null)
    setServerError(null)

    if (!selected) return

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      clearSelection()
      setError('Use a JPEG, PNG, or WebP image.')
      return
    }

    if (selected.size > MAX_SIZE_BYTES) {
      clearSelection()
      setError('Image must be 5MB or smaller.')
      return
    }

    setIsPreviewing(true)

    try {
      const objectUrl = await createSquareCoverPreviewUrl(selected)
      revokePreview()
      previewUrlRef.current = objectUrl
      setPreviewUrl(objectUrl)
      setFile(selected)
    } catch {
      clearSelection()
      setError('Could not preview this image.')
    } finally {
      setIsPreviewing(false)
    }
  }

  const onSubmit = async () => {
    if (mutation.isPending || !file) return

    setServerError(null)

    try {
      const response = await mutation.mutateAsync(file)
      setAvatarUrl(response.avatarUrl)
      toast.success('Avatar updated')
      clearSelection()

      if (username) {
        queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.profile(username) })
        queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.userFeed(username) })
      }

      queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.feed })
      queryClient.invalidateQueries({ queryKey: ['media-reviews'] })
    } catch (submitError) {
      const apiError = await getApiError(submitError)
      setServerError(apiError.message)
    }
  }

  return {
    file,
    previewUrl,
    error,
    serverError,
    onFileChange,
    onSubmit,
    onClear: clearSelection,
    isLoading: mutation.isPending,
    isPreviewing,
    isDirty: file !== null,
  }
}
