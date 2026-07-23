import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/life')({
  beforeLoad: ({ context }) => {
    const { user } = context.auth

    if (!user || user.subscription === 'FREE') {
      // throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  )
}
