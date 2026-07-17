import { createFileRoute, Outlet } from '@tanstack/react-router'

import { Layout } from '../layout/Layout'

export const Route = createFileRoute('/_app')({
  // TODO: uncomment when auth is ready
  // beforeLoad: ({ context }) => {
  //   const { user } = context.auth

  //   if (!user) {
  //     throw redirect({ to: '/auth/login' })
  //   }

  //   if (!user.username) {
  //     throw redirect({ to: '/welcome' })
  //   }
  // },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
