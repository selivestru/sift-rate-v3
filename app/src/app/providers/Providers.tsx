import { Toaster } from '~/common/ui/Sonner'

import { TanstackQueryProvider } from './TanstackQueryProvider'
import { TanstackRouterProvider } from './TanstackRouterProvider'

export const Providers = () => {
  return (
    <TanstackQueryProvider>
      <TanstackRouterProvider />
      <Toaster />
    </TanstackQueryProvider>
  )
}
