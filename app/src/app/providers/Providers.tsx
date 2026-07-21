import { Toaster } from '~/common/ui/Sonner'
import { AuthBootstrap } from '~/modules/auth'

import { MotionProvider } from './MotionProvider'
import { TanstackQueryProvider } from './TanstackQueryProvider'
import { TanstackRouterProvider } from './TanstackRouterProvider'

export const Providers = () => {
  return (
    <TanstackQueryProvider>
      <MotionProvider>
        <AuthBootstrap>
          <TanstackRouterProvider />
        </AuthBootstrap>
      </MotionProvider>
      <Toaster />
    </TanstackQueryProvider>
  )
}
