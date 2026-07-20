import { Toaster } from '~/common/ui/Sonner'
import { AuthBootstrap } from '~/modules/auth'

import { TanstackQueryProvider } from './TanstackQueryProvider'
import { TanstackRouterProvider } from './TanstackRouterProvider'

export const Providers = () => {
  return (
    <TanstackQueryProvider>
      <AuthBootstrap>
        <TanstackRouterProvider />
      </AuthBootstrap>
      <Toaster />
    </TanstackQueryProvider>
  )
}
