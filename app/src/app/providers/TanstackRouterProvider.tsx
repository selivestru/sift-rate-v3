import { useQueryClient } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'

import { useAuthStore } from '~/modules/auth'

import { routeTree } from '../routeTree.gen'

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
    queryClient: undefined!,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export const TanstackRouterProvider = () => {
  const auth = useAuthStore()
  const queryClient = useQueryClient()

  return <RouterProvider router={router} context={{ auth, queryClient }} />
}
