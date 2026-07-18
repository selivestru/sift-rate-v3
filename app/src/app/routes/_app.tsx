import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { Layout } from '../layout/Layout'

export const Route = createFileRoute('/_app')({
  beforeLoad: ({ context }) => {
    const { user } = context.auth

    if (!user) {
      throw redirect({ to: '/auth/login' })
    }

    if (!user.username) {
      throw redirect({ to: '/welcome' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
