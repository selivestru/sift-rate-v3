import { Input as InputPrimitive } from '@base-ui/react/input'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '~/common/utils/cn'

export const inputVariants = cva(
  'w-full min-w-0 rounded-md border border-transparent bg-clip-padding text-sm font-medium transition-colors duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30',
  {
    variants: {
      variant: {
        default:
          'bg-secondary text-foreground hover:bg-accent focus-visible:border-ring focus-visible:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/40',
        outline:
          'border-input bg-background text-foreground hover:bg-accent focus-visible:border-ring focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ring/40',
      },
      size: {
        default: 'h-10 px-3',
        xs: 'h-7 px-2.5 text-xs',
        sm: 'h-9 px-3',
        lg: 'h-11 px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const inputShellClassName = cn(
  'flex items-center gap-1.5 focus-visible:ring-0',
  'focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/40',
  'has-[[aria-invalid=true]]:border-destructive has-[[aria-invalid=true]]:ring-2 has-[[aria-invalid=true]]:ring-destructive/30',
)

const inputIconClassName =
  "inline-flex shrink-0 items-center justify-center text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"

export type InputProps = Omit<React.ComponentProps<'input'>, 'size' | 'aria-invalid'> &
  VariantProps<typeof inputVariants> & {
    isInvalid?: boolean
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
  }

export const Input = ({
  className,
  type,
  variant,
  size,
  isInvalid = false,
  startIcon,
  endIcon,
  ...props
}: InputProps) => {
  const hasIcons = startIcon != null || endIcon != null

  if (!hasIcons) {
    return (
      <InputPrimitive
        type={type}
        data-slot="input"
        className={cn(inputVariants({ variant, size }), className)}
        aria-invalid={isInvalid}
        {...props}
      />
    )
  }

  return (
    <div
      data-slot="input"
      className={cn(
        inputVariants({ variant, size }),
        inputShellClassName,
        variant === 'outline' ? 'focus-within:bg-background' : 'focus-within:bg-secondary',
        className,
      )}
    >
      {startIcon != null && (
        <span data-icon="inline-start" className={inputIconClassName}>
          {startIcon}
        </span>
      )}
      <InputPrimitive
        type={type}
        data-slot="input-control"
        className="placeholder:text-muted-foreground h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-inherit shadow-none ring-0 outline-none focus-visible:ring-0 disabled:cursor-not-allowed"
        {...props}
        aria-invalid={isInvalid || undefined}
      />
      {endIcon != null && (
        <span data-icon="inline-end" className={inputIconClassName}>
          {endIcon}
        </span>
      )}
    </div>
  )
}
