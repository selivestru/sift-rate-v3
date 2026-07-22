import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '~/common/utils/cn'

export const badgeVariants = cva(
  [
    'group/badge inline-flex w-fit shrink-0 items-center justify-center rounded-full border font-semibold',
    'whitespace-nowrap transition-all duration-300 outline-none select-none',
    'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'border-border bg-input/30 text-foreground',
        danger: 'border-danger/30 bg-danger/10 text-danger',
        rating: 'border-rating/30 bg-rating/24 text-rating',
        warning: 'border-warning/40 bg-warning/25 text-warning',
        blur: 'border-transparent bg-secondary/40 text-foreground backdrop-blur-2xl',
        none: 'border-transparent bg-transparent',
      },
      size: {
        sm: "gap-1 px-2 py-0.5 text-[10px] [&_svg:not([class*='size-'])]:size-3",
        md: "gap-1.5 px-2.5 py-1 text-xs [&_svg:not([class*='size-'])]:size-3.5",
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

type BadgeVariantProps = VariantProps<typeof badgeVariants>

export type BadgeProps = useRender.ComponentProps<'span'> &
  Omit<BadgeVariantProps, 'variant'> & {
    variant?: Exclude<BadgeVariantProps['variant'], 'none'>
    color?: string
    isSolid?: boolean
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
  }

const getAccentStyle = (color: string, isSolid: boolean): React.CSSProperties => {
  if (isSolid) {
    return {
      backgroundColor: color,
      borderColor: color,
      color: 'white',
    }
  }

  return {
    backgroundColor: `color-mix(in oklab, ${color} 12%, transparent)`,
    borderColor: `color-mix(in oklab, ${color} 28%, transparent)`,
    color,
  }
}

export const Badge = ({
  className,
  variant = 'default',
  size = 'md',
  color,
  isSolid = false,
  startIcon,
  endIcon,
  render,
  style,
  children,
  ...props
}: BadgeProps) => {
  const hasAccent = Boolean(color)

  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(
          badgeVariants({
            variant: hasAccent ? 'none' : variant,
            size,
          }),
          hasAccent && !isSolid && 'backdrop-blur-xs',
          className,
        ),
        style: hasAccent && color ? { ...getAccentStyle(color, isSolid), ...style } : style,
        children: (
          <>
            {startIcon != null && (
              <span data-icon="inline-start" className="inline-flex shrink-0">
                {startIcon}
              </span>
            )}
            {children}
            {endIcon != null && (
              <span data-icon="inline-end" className="inline-flex shrink-0">
                {endIcon}
              </span>
            )}
          </>
        ),
      },
      props,
    ),
    render,
    state: {
      slot: 'badge',
      variant: hasAccent ? 'none' : variant,
      size,
    },
  })
}
