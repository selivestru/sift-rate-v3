import type { QueryClient } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import { RouteError } from '~/common/ui/RouteError'
import { RoutePending } from '~/common/ui/RoutePending'
import type { AuthState } from '~/modules/auth'

interface MyRouterContext {
  auth: AuthState
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  pendingComponent: RoutePending,
  errorComponent: RouteError,
  notFoundComponent: () => <RouteError error={new Error('Page not found')} />,
})

function RootComponent() {
  return <Outlet />
}
