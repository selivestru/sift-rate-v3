import { Link } from '@tanstack/react-router'

import { BlurMorph } from '~/common/ui/BlurMorph'
import { Button } from '~/common/ui/Button'

import { useRegisterForm } from '../hooks/useRegisterForm'
import { AuthDivider } from './AuthDivider'
import { AuthFormAlert } from './AuthFormAlert'
import { AuthFormHeader } from './AuthFormHeader'
import { AuthTextField } from './AuthTextField'
import { GoogleAuthButton } from './GoogleAuthButton'
import { PasswordField } from './PasswordField'

export const RegisterForm = () => {
  const { register, onSubmit, isLoading, errors, serverError } = useRegisterForm()

  return (
    <BlurMorph.Sections className="flex flex-col gap-6">
      <BlurMorph.SectionsItem>
        <AuthFormHeader
          title="Create your account"
          subtitle="Start building your media life archive"
        />
      </BlurMorph.SectionsItem>

      <BlurMorph.SectionsItem>
        <GoogleAuthButton />
      </BlurMorph.SectionsItem>

      <BlurMorph.SectionsItem>
        <AuthDivider />
      </BlurMorph.SectionsItem>

      <BlurMorph.SectionsItem>
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
      </BlurMorph.SectionsItem>

      <BlurMorph.SectionsItem>
        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{' '}
          <Link to="/auth/login" className="hover:text-primary font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </BlurMorph.SectionsItem>
    </BlurMorph.Sections>
  )
}
