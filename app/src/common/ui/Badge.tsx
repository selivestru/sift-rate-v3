import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '~/common/utils/cn'

export const badgeVariants = cva(
  [
    'group/badge inline-flex w-fit shrink-0 items-center justify-center rounded-full border font-semibold',
    'whitespace-nowrap transition-colors duration-200 outline-none select-none',
    'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'border-border bg-muted text-foreground',
        outline: 'border-border bg-background text-foreground',
        destructive: 'border-border bg-muted text-destructive',
        rating: 'border-border bg-muted text-rating',
        warning: 'border-border bg-muted text-warning',
        blur: 'border-transparent bg-card/50 text-foreground backdrop-blur-sm',
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
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
  }

export const Badge = ({
  className,
  variant = 'default',
  size = 'md',
  color,
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
            variant: hasAccent ? 'default' : variant,
            size,
          }),
          className,
        ),
        style: hasAccent && color ? { color, ...style } : style,
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
      variant: hasAccent ? 'default' : variant,
      size,
    },
  })
}
