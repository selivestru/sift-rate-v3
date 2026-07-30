import { Link } from '@tanstack/react-router'

import { BackButton } from '~/common/ui/BackButton'
import { Button } from '~/common/ui/Button'

import { useResetPasswordForm } from '../hooks/useResetPasswordForm'
import { AuthFormAlert } from './AuthFormAlert'
import { AuthFormHeader } from './AuthFormHeader'
import { PasswordField } from './PasswordField'

interface ResetPasswordFormProps {
  token: string
}

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const { register, onSubmit, isLoading, errors, result, serverError } = useResetPasswordForm(token)

  return (
    <div className="flex flex-col gap-6">
      <BackButton to="/auth/login" />
      {result ? (
        <>
          <AuthFormHeader
            title="Password updated"
            subtitle="Your password has been changed successfully. You can now sign in with your new password."
          />
          <Button type="button" render={<Link to="/auth/login" />}>
            Back to sign in
          </Button>
        </>
      ) : (
        <>
          <AuthFormHeader title="Reset your password" subtitle="Enter your new password below." />

          <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
            {serverError && <AuthFormAlert message={serverError} />}

            <PasswordField
              label="Password"
              autoComplete="new-password"
              placeholder="Enter your password"
              error={errors.password}
              {...register('password')}
            />

            <PasswordField
              label="Confirm password"
              autoComplete="new-password"
              placeholder="Confirm your password"
              error={errors.confirmPassword}
              {...register('confirmPassword')}
            />

            <Button fullWidth type="submit" isLoading={isLoading}>
              {isLoading ? 'Updating…' : 'Update password'}
            </Button>
          </form>
        </>
      )}
    </div>
  )
}
