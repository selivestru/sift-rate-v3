import { XCircle } from 'reicon-react'

import { CONTENT_MAX_LENGTH } from '~/common/schema/content.schema'
import { Alert, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'
import { FieldError } from '~/common/ui/Field'
import { Textarea } from '~/common/ui/Textarea'
import { cn } from '~/common/utils/cn'
import { useCreatePostForm } from '~/modules/post'

interface PostComposerFormProps {
  onClose: () => void
}

export const PostComposerForm = ({ onClose }: PostComposerFormProps) => {
  const { register, errors, onSubmit, isLoading, serverError, isValid, content } =
    useCreatePostForm({
      onSuccess: onClose,
    })

  const contentLength = content.length

  return (
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
        className="min-h-52"
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
          Publish post
        </Button>
      </div>
    </form>
  )
}
