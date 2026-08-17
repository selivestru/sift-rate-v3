import { Controller, useWatch } from 'react-hook-form'
import { ArrowUp, XCircle } from 'reicon-react'

import { Alert, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'
import { FieldError } from '~/common/ui/Field'
import { Textarea } from '~/common/ui/Textarea'

import { useCreateReplyForm } from '../hooks/useCreateReplyForm'

interface PostReplyInputProps {
  postId: string
  author: string
}

export const PostReplyInput = ({ author, postId }: PostReplyInputProps) => {
  const { errors, onSubmit, isLoading, serverError, control } = useCreateReplyForm(postId)

  const content = useWatch({
    name: 'content',
    control,
  })

  const placeholder = `Reply to ${author}...`
  const isOverLimit = errors.content?.type === 'too_big'

  return (
    <form onSubmit={onSubmit} className="space-y-2 p-3" noValidate>
      {serverError && (
        <Alert variant="destructive">
          <XCircle />
          <AlertTitle>{serverError}</AlertTitle>
        </Alert>
      )}

      <div className="flex items-end gap-2">
        <Controller
          control={control}
          name="content"
          render={({ field }) => (
            <Textarea
              placeholder={placeholder}
              aria-label={placeholder}
              isInvalid={isOverLimit}
              className="min-h-10 flex-1 py-2"
              {...field}
            />
          )}
        />
        <Button
          type="submit"
          isIconOnly
          isLoading={isLoading}
          isDisabled={!content.trim().length}
          aria-label="Post comment"
        >
          <ArrowUp />
        </Button>
      </div>
      {isOverLimit && errors.content && <FieldError>{errors.content.message}</FieldError>}
    </form>
  )
}
