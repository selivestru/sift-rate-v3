import { Link } from '@tanstack/react-router'

import { BackButton } from '~/common/ui/BackButton'
import { Button } from '~/common/ui/Button'
import { TimerButton } from '~/common/ui/TimerButton'

import { useForgotPasswordForm } from '../hooks/useForgotPasswordForm'
import { AuthFormAlert } from './AuthFormAlert'
import { AuthFormHeader } from './AuthFormHeader'
import { AuthTextField } from './AuthTextField'

export const ForgotPasswordForm = () => {
  const { register, onSubmit, isLoading, errors, result, serverError } = useForgotPasswordForm()

  return (
    <div className="flex flex-col gap-6">
      <BackButton to="/auth/login" />

      <AuthFormHeader
        title={result ? 'Check your email' : 'Reset password'}
        subtitle={
          result
            ? "If an account exists for this email address, we've sent a password reset link. Please check your inbox and spam folder."
            : 'Enter your email and we will send a reset link'
        }
      />

      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        {result ? (
          <div className="flex flex-col gap-2">
            <Button type="button" render={<Link to="/auth/login" />}>
              Back to sign in
            </Button>
            <TimerButton type="submit" ttl={result.ttl} label="Reset link sent" />
          </div>
        ) : (
          <>
            {serverError && <AuthFormAlert message={serverError} />}

            <AuthTextField
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              error={errors.email}
              {...register('email')}
            />

            <Button fullWidth type="submit" isLoading={isLoading}>
              {isLoading ? 'Sending…' : 'Send reset link'}
            </Button>
          </>
        )}
      </form>
    </div>
  )
}
