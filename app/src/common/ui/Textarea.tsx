import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '~/common/utils/cn'

export const textareaVariants = cva(
  'flex field-sizing-content min-h-16 w-full resize-none rounded-3xl border border-transparent bg-clip-padding px-3 py-3 text-sm font-medium transition-all duration-300 outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger/40 aria-invalid:bg-danger-soft aria-invalid:ring-[3px] aria-invalid:ring-danger/20 dark:aria-invalid:border-danger/50 dark:aria-invalid:ring-danger/40',
  {
    variants: {
      variant: {
        default: 'bg-secondary text-foreground hover:bg-secondary-hover focus-visible:bg-secondary',
        outline:
          'border-border bg-input/30 text-foreground hover:bg-input/50 focus-visible:bg-input/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type TextareaProps = Omit<React.ComponentProps<'textarea'>, 'aria-invalid'> &
  VariantProps<typeof textareaVariants> & {
    isInvalid?: boolean
  }

export const Textarea = ({ className, variant, isInvalid = false, ...props }: TextareaProps) => {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ variant }), className)}
      {...props}
      aria-invalid={isInvalid || undefined}
    />
  )
}
