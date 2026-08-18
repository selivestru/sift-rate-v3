import { useEffect } from 'react'
import { XCircle } from 'reicon-react'

import { CONTENT_MAX_LENGTH } from '~/common/schema/content.schema'
import { Alert, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/common/ui/Dialog'
import { FieldError } from '~/common/ui/Field'
import { Textarea } from '~/common/ui/Textarea'
import { cn } from '~/common/utils/cn'

import { usePostForm } from '../hooks/usePostForm'

interface PostFormProps {
  mode: 'create' | 'edit'
  open: boolean
  onClose: () => void
  postId?: string
  initialContent?: string
  parentId?: string | null
}

export const PostForm = ({
  mode,
  open,
  onClose,
  postId,
  initialContent,
  parentId,
}: PostFormProps) => {
  const { register, errors, onSubmit, isLoading, serverError, isValid, content, reset } =
    usePostForm({
      postId,
      initialContent,
      parentId,
      onSuccess: onClose,
    })

  const isEdit = mode === 'edit'
  const contentLength = content.length

  useEffect(() => {
    if (!open) return

    reset({ content: initialContent ?? '' })
  }, [open, initialContent, reset])

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isLoading) onClose()
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit post' : 'Create post'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {serverError && (
            <Alert variant="destructive">
              <XCircle />
              <AlertTitle>{serverError}</AlertTitle>
            </Alert>
          )}

          <Textarea
            autoFocus
            placeholder="What's new?"
            aria-label="Post content"
            isInvalid={!!errors.content}
            className="min-h-40"
            {...register('content')}
          />

          <div className="flex items-center justify-between text-sm">
            {errors.content && <FieldError>{errors.content.message}</FieldError>}

            <p
              className={cn(
                'tabular-nums ml-auto',
                contentLength > CONTENT_MAX_LENGTH && 'text-destructive',
              )}
              aria-live="polite"
            >
              {contentLength > CONTENT_MAX_LENGTH
                ? `-${contentLength - CONTENT_MAX_LENGTH}`
                : `${contentLength}/${CONTENT_MAX_LENGTH}`}
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" isLoading={isLoading} isDisabled={!isValid || !content.trim()}>
              {isEdit ? 'Save' : 'Publish post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
