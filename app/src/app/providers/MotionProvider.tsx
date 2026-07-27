import { LazyMotion, domMax } from 'motion/react'

export const MotionProvider = ({ children }: React.PropsWithChildren) => {
  return <LazyMotion features={domMax}>{children}</LazyMotion>
}
