import { Toaster } from '~/common/ui/Sonner'

import { AnimationProvider } from './AnimationProvider'
import { TanstackQueryProvider } from './TanstackQueryProvider'
import { TanstackRouterProvider } from './TanstackRouterProvider'

export const Providers = () => {
  return (
    <TanstackQueryProvider>
      <AnimationProvider>
        <TanstackRouterProvider />
        <Toaster />
      </AnimationProvider>
    </TanstackQueryProvider>
  )
}
