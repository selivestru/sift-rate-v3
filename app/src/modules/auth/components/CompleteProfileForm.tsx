import { useIntlayer } from 'react-intlayer'
import { XCircle } from 'reicon-react'

import { Alert, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'
import { Field, FieldDescription, FieldError, FieldLabel } from '~/common/ui/Field'
import { Input } from '~/common/ui/Input'

import { useCompleteProfileForm } from '../hooks/useCompleteProfileForm'

export const CompleteProfileForm = () => {
  const { register, onSubmit, isLoading, errors, serverError } = useCompleteProfileForm()
  const content = useIntlayer('complete-profile-form')
  const shared = useIntlayer('shared')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-md text-sm font-semibold">
          S
        </span>

        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">{content.title.value}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {content.description.value}
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

        <Field isInvalid={!!errors.displayName}>
          <FieldLabel htmlFor="displayName">{content.displayNameLabel.value}</FieldLabel>
          <Input
            id="displayName"
            autoComplete="nickname"
            placeholder={content.displayNamePlaceholder.value}
            isInvalid={!!errors.displayName}
            {...register('displayName')}
          />
          {errors.displayName ? (
            <FieldError>{errors.displayName.message}</FieldError>
          ) : (
            <FieldDescription>{content.displayNameHint.value}</FieldDescription>
          )}
        </Field>

        <Field isInvalid={!!errors.username}>
          <FieldLabel htmlFor="username">{content.usernameLabel.value}</FieldLabel>
          <Input
            id="username"
            autoComplete="username"
            autoCapitalize="off"
            spellCheck={false}
            placeholder={content.usernamePlaceholder.value}
            isInvalid={!!errors.username}
            startIcon={<span className="text-muted-foreground text-sm font-medium">@</span>}
            {...register('username')}
          />
          {errors.username ? (
            <FieldError>{errors.username.message}</FieldError>
          ) : (
            <FieldDescription>{content.usernameHint.value}</FieldDescription>
          )}
        </Field>

        <Button type="submit" fullWidth isLoading={isLoading}>
          {isLoading ? content.saving.value : shared.save.value}
        </Button>
      </form>
    </div>
  )
}
