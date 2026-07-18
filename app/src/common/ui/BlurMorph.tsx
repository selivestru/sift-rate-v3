import { AnimatePresence, m, stagger, useReducedMotion, type Variants } from 'motion/react'
import { useMemo } from 'react'

const STAGGER_S = 0.1
const DURATION_S = 0.3
const REDUCED_DURATION_S = 0.01
const BLUR = 'blur(10px)'
const BLUR_NONE = 'blur(0px)'
const SCALE_FROM = 0.97

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: stagger(STAGGER_S),
    },
  },
}

const itemVariantsFull: Variants = {
  hidden: {
    opacity: 0,
    filter: BLUR,
    scale: SCALE_FROM,
  },
  visible: {
    opacity: 1,
    filter: BLUR_NONE,
    scale: 1,
  },
  exit: {
    opacity: 0,
    filter: BLUR,
    scale: SCALE_FROM,
  },
}

const itemVariantsReduced: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
}

type BlurMorphBoxProps = {
  children?: React.ReactNode
  className?: string
}

type BlurMorphPresenceMode = 'wait' | 'sync' | 'popLayout'

type BlurMorphPresenceProps = {
  stateKey: string | number
  children?: React.ReactNode
  className?: string
  mode?: BlurMorphPresenceMode
}

const useBlurMorphItemMotion = () => {
  const reduceMotion = useReducedMotion()

  return useMemo(
    () => ({
      variants: reduceMotion ? itemVariantsReduced : itemVariantsFull,
      transition: {
        duration: reduceMotion ? REDUCED_DURATION_S : DURATION_S,
      },
    }),
    [reduceMotion],
  )
}

const BlurMorphSections = ({ children, ...props }: BlurMorphBoxProps) => {
  return (
    <m.div variants={containerVariants} initial="hidden" animate="visible" {...props}>
      {children}
    </m.div>
  )
}

const BlurMorphSectionsItem = ({ children, ...props }: BlurMorphBoxProps) => {
  const { variants, transition } = useBlurMorphItemMotion()

  return (
    <m.div variants={variants} transition={transition} {...props}>
      {children}
    </m.div>
  )
}

const BlurMorphList = ({ children, ...props }: BlurMorphBoxProps) => {
  return (
    <m.div variants={containerVariants} initial="hidden" animate="visible" {...props}>
      <AnimatePresence mode="popLayout">{children}</AnimatePresence>
    </m.div>
  )
}

const BlurMorphListItem = ({ children, ...props }: BlurMorphBoxProps) => {
  const { variants, transition } = useBlurMorphItemMotion()

  return (
    <m.div layout="position" variants={variants} transition={transition} {...props}>
      {children}
    </m.div>
  )
}

const BlurMorphPresence = ({
  stateKey,
  children,
  mode = 'wait',
  ...props
}: BlurMorphPresenceProps) => {
  const { variants, transition } = useBlurMorphItemMotion()

  return (
    <AnimatePresence mode={mode} initial={false}>
      <m.div
        key={stateKey}
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={transition}
        {...props}
      >
        {children}
      </m.div>
    </AnimatePresence>
  )
}

export const BlurMorph = {
  Sections: BlurMorphSections,
  SectionsItem: BlurMorphSectionsItem,
  List: BlurMorphList,
  ListItem: BlurMorphListItem,
  Presence: BlurMorphPresence,
} as const
