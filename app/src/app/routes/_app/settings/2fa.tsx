import { createFileRoute, redirect } from '@tanstack/react-router'

import { AUTH_METHOD } from '~/modules/auth'
import { TwoFactorSettings } from '~/modules/settings'

export const Route = createFileRoute('/_app/settings/2fa')({
  beforeLoad: ({ context }) => {
    const { user } = context.auth

    if (!user) {
      throw redirect({ to: '/auth/login' })
    }

    if (user.method === AUTH_METHOD.GOOGLE) {
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <TwoFactorSettings />
}
