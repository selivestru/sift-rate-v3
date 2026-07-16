import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="grid min-h-dvh w-full place-items-center">
      <Outlet />
    </div>
  )
}
