import { AnimatePresence, m, stagger, type HTMLMotionProps, type Variants } from 'motion/react'

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: stagger(0.1),
    },
  },
}

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(10px)',
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
  },
  exit: {
    opacity: 0,
    filter: 'blur(10px)',
    scale: 0.98,
  },
}

interface BlurMorphProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode
  mode?: 'sync' | 'popLayout' | 'wait'
  layout?: boolean
}

export const BlurMorphList = ({
  children,
  mode = 'popLayout',
  layout = true,
  ...props
}: BlurMorphProps) => {
  return (
    <m.div
      layout={layout}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      <AnimatePresence mode={mode}>{children}</AnimatePresence>
    </m.div>
  )
}

export const BlurMorphListItem = ({ children, ...props }: BlurMorphProps) => {
  return (
    <m.div layout="position" variants={itemVariants} transition={{ duration: 0.3 }} {...props}>
      {children}
    </m.div>
  )
}

export const BlurMorphSections = ({ children, ...props }: BlurMorphProps) => {
  return (
    <m.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      {...props}
    >
      {children}
    </m.div>
  )
}

export const BlurMorphSectionsItem = ({ children, ...props }: BlurMorphProps) => {
  return (
    <m.div variants={itemVariants} transition={{ duration: 0.3 }} {...props}>
      {children}
    </m.div>
  )
}
