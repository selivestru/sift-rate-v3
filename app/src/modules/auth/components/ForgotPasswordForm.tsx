import { Button, Spinner } from '@heroui/react'
import { Link } from '@tanstack/react-router'

import { BlurMorphSections, BlurMorphSectionsItem } from '~/common/ui/BlurMorph'

import { useForgotPasswordForm } from '../hooks/useForgotPasswordForm'
import { AuthFormAlert } from './AuthFormAlert'
import { AuthFormHeader } from './AuthFormHeader'
import { AuthTextField } from './AuthTextField'

export const ForgotPasswordForm = () => {
  const { register, onSubmit, isLoading, errors, isSuccess, serverError } = useForgotPasswordForm()

  if (isSuccess) {
    return (
      <BlurMorphSections className="flex flex-col gap-6">
        <BlurMorphSectionsItem>
          <AuthFormHeader
            title="Check your email"
            subtitle="If an account exists for that address, we sent a reset link."
          />
        </BlurMorphSectionsItem>
        <BlurMorphSectionsItem>
          <p className="text-muted text-center text-sm">
            <Link
              to="/auth/login"
              className="text-foreground hover:text-accent font-medium transition-colors"
            >
              Back to sign in
            </Link>
          </p>
        </BlurMorphSectionsItem>
      </BlurMorphSections>
    )
  }

  return (
    <BlurMorphSections className="flex flex-col gap-6">
      <BlurMorphSectionsItem>
        <AuthFormHeader
          title="Reset password"
          subtitle="Enter your email and we will send a reset link"
        />
      </BlurMorphSectionsItem>

      <BlurMorphSectionsItem>
        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          {serverError && <AuthFormAlert message={serverError} />}

          <AuthTextField
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            error={errors.email}
            {...register('email')}
          />

          <Button type="submit" fullWidth isDisabled={isLoading} isPending={isLoading}>
            {isLoading && <Spinner color="current" />}
            {isLoading ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>
      </BlurMorphSectionsItem>

      <BlurMorphSectionsItem>
        <p className="text-muted text-center text-sm">
          <Link
            to="/auth/login"
            className="text-foreground hover:text-accent font-medium transition-colors"
          >
            Back to sign in
          </Link>
        </p>
      </BlurMorphSectionsItem>
    </BlurMorphSections>
  )
}
