import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '~/common/utils/cn'

export const badgeVariants = cva(
  'group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-danger aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40 [&>svg]:pointer-events-none [&>svg]:size-3!',
  {
    variants: {
      variant: {
        default: 'bg-secondary [a]:hover:bg-secondary/80',
        danger:
          'bg-danger/10 text-danger focus-visible:ring-danger/20 dark:bg-danger/20 dark:focus-visible:ring-danger/40 [a]:hover:bg-danger/20',
        outline: 'border-border bg-input/30 [a]:hover:bg-muted [a]:hover:text-muted-foreground',
        blur: 'bg-secondary/40 [a]:hover:bg-secondary/80 backdrop-blur-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const Badge = ({
  className,
  variant = 'default',
  render,
  ...props
}: useRender.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) => {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: 'badge',
      variant,
    },
  })
}
