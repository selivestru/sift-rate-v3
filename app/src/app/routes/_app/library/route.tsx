import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/library')({
  beforeLoad: ({ context }) => {
    const { user } = context.auth

    if (!user) {
      throw redirect({ to: '/auth' })
    }
  },

  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
