import { LazyMotion, domAnimation } from 'motion/react'

export const MotionProvider = ({ children }: React.PropsWithChildren) => {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>
}
