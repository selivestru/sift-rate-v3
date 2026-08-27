import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useIntlayer } from 'react-intlayer'
import { toast } from 'sonner'

import { getApiError, translateApiErrorMessage } from '~/common/api'
import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { useAuthStore } from '~/modules/auth'

import { useChangeAvatarMutation } from './useChangeAvatarMutation'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024
const EDITOR_OPEN_DELAY_MS = 250

export type ChangeAvatarStage = 'idle' | 'crop' | 'save'

type AvatarImage = {
  file: File
  url: string
}

export const useChangeAvatarForm = () => {
  const content = useIntlayer('user-change-avatar-form')
  const mutation = useChangeAvatarMutation()
  const queryClient = useQueryClient()
  const username = useAuthStore((state) => state.user?.username)
  const setAvatarUrl = useAuthStore((state) => state.setAvatarUrl)

  const [stage, setStage] = useState<ChangeAvatarStage>('idle')
  const [source, setSource] = useState<AvatarImage | null>(null)
  const [preview, setPreview] = useState<AvatarImage | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const sourceUrlRef = useRef<string | null>(null)
  const previewUrlRef = useRef<string | null>(null)
  const openTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const sourceUrl = sourceUrlRef
    const previewUrl = previewUrlRef
    const openTimeout = openTimeoutRef
    return () => {
      if (openTimeout.current !== null) window.clearTimeout(openTimeout.current)
      if (sourceUrl.current) URL.revokeObjectURL(sourceUrl.current)
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current)
    }
  }, [])

  const clearOpenTimeout = () => {
    if (openTimeoutRef.current !== null) {
      window.clearTimeout(openTimeoutRef.current)
      openTimeoutRef.current = null
    }
  }

  const revokeSource = () => {
    if (sourceUrlRef.current) {
      URL.revokeObjectURL(sourceUrlRef.current)
      sourceUrlRef.current = null
    }
  }

  const revokePreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
  }

  const clearSelection = () => {
    clearOpenTimeout()
    revokeSource()
    revokePreview()
    setSource(null)
    setPreview(null)
    setStage('idle')
  }

  const onFileChange = (fileList: FileList | null) => {
    const selected = fileList?.[0]
    setError(null)
    setServerError(null)

    if (!selected) return

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      clearSelection()
      setError(content.invalidType.value)
      return
    }

    if (selected.size > MAX_SIZE_BYTES) {
      clearSelection()
      setError(content.maxSize.value)
      return
    }

    clearOpenTimeout()
    revokeSource()
    revokePreview()

    const nextSource: AvatarImage = { file: selected, url: URL.createObjectURL(selected) }
    sourceUrlRef.current = nextSource.url
    setSource(nextSource)
    setPreview(null)
    setStage('idle')
    openTimeoutRef.current = window.setTimeout(() => setStage('crop'), EDITOR_OPEN_DELAY_MS)
  }

  const onCropConfirm = (file: File) => {
    revokePreview()

    const nextPreview: AvatarImage = { file, url: URL.createObjectURL(file) }
    previewUrlRef.current = nextPreview.url
    setPreview(nextPreview)
    setServerError(null)
    setStage('save')
  }

  const onBackToCrop = () => {
    if (mutation.isPending) return

    setServerError(null)
    setStage('crop')
  }

  const onSubmit = async () => {
    if (mutation.isPending || !preview) return

    setServerError(null)

    try {
      const response = await mutation.mutateAsync(preview.file)
      setAvatarUrl(response.avatarUrl)
      toast.success(content.updated.value)
      clearSelection()

      if (username) {
        queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.profile(username) })
        queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.userFeed(username) })
      }

      queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.feed })
      queryClient.invalidateQueries({ queryKey: ['media-reviews'] })
    } catch (submitError) {
      const apiError = await getApiError(submitError)
      setServerError(translateApiErrorMessage(apiError.message))
    }
  }

  return {
    stage,
    source,
    preview,
    error,
    serverError,
    onFileChange,
    onCropConfirm,
    onBackToCrop,
    onSubmit,
    onClear: clearSelection,
    isLoading: mutation.isPending,
  }
}
