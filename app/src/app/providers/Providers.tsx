import { ThemeProvider } from '~/common/theme'
import { Toaster } from '~/common/ui/Sonner'
import { TooltipProvider } from '~/common/ui/Tooltip'
import { AuthBootstrap } from '~/modules/auth'

import { MotionProvider } from './MotionProvider'
import { TanstackQueryProvider } from './TanstackQueryProvider'
import { TanstackRouterProvider } from './TanstackRouterProvider'

export const Providers = () => {
  return (
    <TanstackQueryProvider>
      <MotionProvider>
        <ThemeProvider>
          <AuthBootstrap>
            <TooltipProvider>
              <TanstackRouterProvider />
            </TooltipProvider>
          </AuthBootstrap>
        </ThemeProvider>
      </MotionProvider>
      <Toaster />
    </TanstackQueryProvider>
  )
}
