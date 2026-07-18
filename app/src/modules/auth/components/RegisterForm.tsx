import { Link } from '@tanstack/react-router'

import { BlurMorphSections, BlurMorphSectionsItem } from '~/common/ui/BlurMorph'
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
    <BlurMorphSections className="flex flex-col gap-6">
      <BlurMorphSectionsItem>
        <AuthFormHeader
          title="Create your account"
          subtitle="Start building your media life archive"
        />
      </BlurMorphSectionsItem>

      <BlurMorphSectionsItem>
        <GoogleAuthButton />
      </BlurMorphSectionsItem>

      <BlurMorphSectionsItem>
        <AuthDivider />
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
      </BlurMorphSectionsItem>

      <BlurMorphSectionsItem>
        <p className="text-muted text-center text-sm">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="text-foreground hover:text-accent font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </BlurMorphSectionsItem>
    </BlurMorphSections>
  )
}
