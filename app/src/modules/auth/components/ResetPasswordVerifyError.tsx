import { Link } from '@tanstack/react-router'

import { Button } from '~/common/ui/Button'

import { AuthFormHeader } from './AuthFormHeader'

export const ResetPasswordVerifyError = () => {
  return (
    <div className="flex flex-col gap-4">
      <AuthFormHeader
        title="Password reset link expired"
        subtitle="This password reset link is invalid or has expired. Please request a new password reset link."
      />
      <Button type="button" render={<Link to="/auth/forgot-password" />}>
        Request new reset link
      </Button>
    </div>
  )
}
