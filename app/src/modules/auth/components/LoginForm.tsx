import { Button, Spinner } from '@heroui/react'
import { Link } from '@tanstack/react-router'

import { useLoginForm } from '../hooks/useLoginForm'
import { AuthDivider } from './AuthDivider'
import { AuthFormAlert } from './AuthFormAlert'
import { AuthFormHeader } from './AuthFormHeader'
import { AuthTextField } from './AuthTextField'
import { GoogleAuthButton } from './GoogleAuthButton'
import { PasswordField } from './PasswordField'

export const LoginForm = () => {
  const { register, onSubmit, isLoading, errors, serverError } = useLoginForm()

  return (
    <div className="flex flex-col gap-6">
      <AuthFormHeader title="Welcome back" subtitle="Sign in to your media archive" />

      <GoogleAuthButton />

      <AuthDivider />

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

        <PasswordField
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password}
          labelEnd={
            <Link
              to="/auth/forgot-password"
              className="text-muted hover:text-foreground text-xs font-medium transition-colors"
            >
              Forgot password?
            </Link>
          }
          {...register('password')}
        />

        <Button type="submit" fullWidth isDisabled={isLoading} isPending={isLoading}>
          {isLoading && <Spinner color="current" />}
          {isLoading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="text-muted text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link
          to="/auth/register"
          className="text-foreground hover:text-accent font-medium transition-colors"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}
