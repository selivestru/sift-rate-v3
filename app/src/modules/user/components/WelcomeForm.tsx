import { useNavigate } from '@tanstack/react-router'
import { XCircle } from 'reicon-react'

import { Alert, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'
import { Field, FieldDescription, FieldError, FieldLabel } from '~/common/ui/Field'
import { Input } from '~/common/ui/Input'

import { useChangeUsernameForm } from '../hook/useChangeUsernameForm'

export const WelcomeForm = () => {
  const navigate = useNavigate()
  const { register, onSubmit, isLoading, errors, serverError } = useChangeUsernameForm(() => {
    navigate({ to: '/' })
  })
  const usernameError = errors.username
  const isInvalid = !!usernameError

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-md text-sm font-semibold">
          S
        </span>

        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">Choose your username</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            This is your public handle on SiftRate — how others find your media archive.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        {serverError && (
          <Alert variant="destructive">
            <XCircle />
            <AlertTitle>{serverError}</AlertTitle>
          </Alert>
        )}

        <Field isInvalid={isInvalid}>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            type="text"
            autoComplete="username"
            autoFocus
            autoCapitalize="off"
            spellCheck={false}
            placeholder="your_handle"
            isInvalid={isInvalid}
            startIcon={<span className="text-muted-foreground text-sm font-medium">@</span>}
            {...register('username')}
          />
          {usernameError?.message ? (
            <FieldError>{usernameError.message}</FieldError>
          ) : (
            <FieldDescription>
              4–25 characters. Letters, numbers, and underscores only.
            </FieldDescription>
          )}
        </Field>

        <Button type="submit" fullWidth isLoading={isLoading}>
          {isLoading ? 'Saving…' : 'Continue'}
        </Button>
      </form>
    </div>
  )
}
