import { I18nProvider } from '~/common/i18n'
import { Toaster } from '~/common/ui/Sonner'
import { TooltipProvider } from '~/common/ui/Tooltip'
import { AuthBootstrap } from '~/modules/auth'

import { MotionProvider } from './MotionProvider'
import { TanstackQueryProvider } from './TanstackQueryProvider'
import { TanstackRouterProvider } from './TanstackRouterProvider'

export const Providers = () => {
  return (
    <TanstackQueryProvider>
      <I18nProvider>
        <MotionProvider>
          <AuthBootstrap>
            <TooltipProvider>
              <TanstackRouterProvider />
            </TooltipProvider>
          </AuthBootstrap>
        </MotionProvider>
        <Toaster />
      </I18nProvider>
    </TanstackQueryProvider>
  )
}
