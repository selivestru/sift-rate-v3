import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { Layout } from '../layout/Layout'

export const Route = createFileRoute('/_app')({
  beforeLoad: ({ context }) => {
    const { user } = context.auth

    if (user && !user.username) {
      throw redirect({ to: '/complete-profile' })
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
