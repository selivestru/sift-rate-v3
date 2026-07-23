import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '~/common/utils/cn'

export const textareaVariants = cva(
  'flex field-sizing-content min-h-16 w-full resize-none rounded-md border border-transparent bg-clip-padding px-3 py-3 text-sm font-medium transition-colors duration-200 outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30',
  {
    variants: {
      variant: {
        default: 'bg-secondary text-foreground hover:bg-accent focus-visible:bg-secondary',
        outline:
          'border-input bg-background text-foreground hover:bg-accent focus-visible:bg-background',
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
