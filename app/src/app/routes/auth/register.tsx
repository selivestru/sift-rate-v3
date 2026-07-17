import { createFileRoute } from '@tanstack/react-router'

import { RegisterForm } from '~/modules/auth'

export const Route = createFileRoute('/auth/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RegisterForm />
}
