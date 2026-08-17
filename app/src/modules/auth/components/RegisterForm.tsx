import { Link } from '@tanstack/react-router'

import { BackButton } from '~/common/ui/BackButton'
import { Button } from '~/common/ui/Button'
import { PasswordField } from '~/common/ui/PasswordField'

import { useRegisterForm } from '../hooks/useRegisterForm'
import { AuthDivider } from './AuthDivider'
import { AuthFormAlert } from './AuthFormAlert'
import { AuthFormHeader } from './AuthFormHeader'
import { AuthTextField } from './AuthTextField'
import { EmailVerificationDialog } from './EmailVerificationDialog'
import { GoogleAuthButton } from './GoogleAuthButton'

export const RegisterForm = () => {
  const { register, onSubmit, isLoading, errors, serverError, emailVerificationDialog } =
    useRegisterForm()

  return (
    <>
      <div className="flex flex-col gap-6">
        <BackButton render={<Link to="/auth/login" />} />

        <AuthFormHeader
          title="Create your account"
          subtitle="Start building your media life archive"
        />

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

          <AuthTextField
            label="Username"
            type="text"
            autoComplete="username"
            placeholder="Enter your username"
            error={errors.username}
            {...register('username')}
          />

          <AuthTextField
            label="Display name"
            type="text"
            autoComplete="name"
            placeholder="Enter your display name"
            error={errors.displayName}
            {...register('displayName')}
          />

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

          <Button type="submit" fullWidth isLoading={isLoading}>
            {isLoading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{' '}
          <Link to="/auth/login" className="hover:text-primary font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <EmailVerificationDialog
        open={emailVerificationDialog.opened}
        onOpenChange={emailVerificationDialog.toggle}
      />
    </>
  )
}
