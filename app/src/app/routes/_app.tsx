import { createFileRoute, Outlet } from '@tanstack/react-router'

import { Layout } from '../layout/Layout'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
