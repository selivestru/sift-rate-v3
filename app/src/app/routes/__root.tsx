import type { QueryClient } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import type { AuthState } from '~/modules/auth'

import { AppBackdrop } from '../layout/AppBackdrop'

interface MyRouterContext {
  auth: AuthState
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <AppBackdrop />
      <div className="z-px relative">
        <Outlet />
      </div>
    </>
  )
}
