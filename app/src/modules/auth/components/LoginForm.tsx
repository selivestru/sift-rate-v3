import { Link } from '@tanstack/react-router'

import { BackButton } from '~/common/ui/BackButton'
import { Button } from '~/common/ui/Button'

import { useLoginForm } from '../hooks/useLoginForm'
import { AuthDivider } from './AuthDivider'
import { AuthFormAlert } from './AuthFormAlert'
import { AuthFormHeader } from './AuthFormHeader'
import { AuthTextField } from './AuthTextField'
import { GoogleAuthButton } from './GoogleAuthButton'
import { PasswordField } from './PasswordField'
import { ResendVerificationDialog } from './ResendVerificationDialog'
import { TwoFactorDialog } from './TwoFactorDialog'

export const LoginForm = () => {
  const { register, onSubmit, isLoading, errors, serverError, twoFactorState, resendState } =
    useLoginForm()

  return (
    <>
      <div className="flex flex-col gap-6">
        <BackButton to="/" />

        <AuthFormHeader title="Welcome back" subtitle="Sign in to your media archive" />

        <GoogleAuthButton />

        <AuthDivider />

        <form id="login-form" onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          {serverError && <AuthFormAlert message={serverError} />}

          <AuthTextField
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            error={errors.email}
            {...register('email')}
          />

          <PasswordField
            label="Password"
            autoComplete="current-password"
            placeholder="Enter your password"
            error={errors.password}
            labelEnd={
              <Link
                to="/auth/forgot-password"
                className="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
              >
                Forgot password?
              </Link>
            }
            {...register('password')}
          />

          <Button fullWidth type="submit" isLoading={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="text-muted-foreground text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link to="/auth/register" className="hover:text-primary font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </div>

      <TwoFactorDialog
        isOpen={twoFactorState.isOpen}
        onClose={twoFactorState.onClose}
        onSubmit={twoFactorState.onSubmit}
        isLoading={isLoading}
        error={serverError}
      />

      <ResendVerificationDialog
        isOpen={resendState.isOpen}
        email={resendState.email}
        isLoading={resendState.isLoading}
        result={resendState.result}
        error={resendState.error}
        cooldownSeconds={resendState.cooldownSeconds}
        onResend={resendState.onResend}
        onClose={resendState.onClose}
      />
    </>
  )
}
