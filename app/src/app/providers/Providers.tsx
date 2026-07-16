import { Toast } from '@heroui/react'

import { AnimationProvider } from './AnimationProvider'
import { TanstackQueryProvider } from './TanstackQueryProvider'
import { TanstackRouterProvider } from './TanstackRouterProvider'

export const Providers = () => {
  return (
    <TanstackQueryProvider>
      <AnimationProvider>
        <TanstackRouterProvider />
        <Toast.Provider placement="top" />
      </AnimationProvider>
    </TanstackQueryProvider>
  )
}
