import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/welcome')({
  beforeLoad: ({ context }) => {
    const { user } = context.auth

    if (!user) {
      throw redirect({ to: '/auth/login' })
    }

    if (user.username) {
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Welcome</div>
}
