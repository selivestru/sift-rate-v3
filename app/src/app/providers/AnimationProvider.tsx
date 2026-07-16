import { domMax, LazyMotion } from 'motion/react'

export const AnimationProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <LazyMotion features={domMax} strict>
      {children}
    </LazyMotion>
  )
}
