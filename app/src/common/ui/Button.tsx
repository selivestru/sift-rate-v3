import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { Spinner } from '~/common/ui/Spinner'
import { cn } from '~/common/utils/cn'

export const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 gap-2",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-[color-mix(in_oklab,var(--primary)_88%,black)]',
        secondary:
          'bg-secondary text-primary hover:bg-accent hover:border-ring/40 aria-expanded:bg-accent',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-[color-mix(in_oklab,var(--destructive)_88%,black)] focus-visible:border-destructive focus-visible:ring-destructive/30',
        'destructive-soft':
          'text-destructive bg-destructive/20 hover:bg-destructive/30 aria-expanded:bg-accent aria-expanded:text-destructive focus-visible:border-destructive focus-visible:ring-destructive/30',
        outline:
          'border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent',
        ghost:
          'hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5',
        xs: "h-7 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-9 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        lg: 'h-11 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
        icon: 'size-10',
      },
      isIconOnly: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        isIconOnly: true,
        size: 'default',
        class: 'size-10 gap-0 p-0',
      },
      {
        isIconOnly: true,
        size: 'xs',
        class: 'size-7 gap-0 p-0',
      },
      {
        isIconOnly: true,
        size: 'sm',
        class: 'size-9 gap-0 p-0',
      },
      {
        isIconOnly: true,
        size: 'lg',
        class: 'size-11 gap-0 p-0',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      isIconOnly: false,
    },
  },
)

export type ButtonProps = Omit<ButtonPrimitive.Props, 'disabled'> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
    fullWidth?: boolean
    isDisabled?: boolean
    /** @deprecated Use `isDisabled` instead */
    disabled?: boolean
  }

export const Button = ({
  className,
  variant = 'default',
  size = 'default',
  isIconOnly = false,
  isLoading = false,
  startIcon,
  endIcon,
  fullWidth = false,
  isDisabled = false,
  disabled = false,
  render,
  nativeButton,
  children,
  ...props
}: ButtonProps) => {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, isIconOnly }),
        fullWidth && 'w-full',
        className,
      )}
      render={render}
      nativeButton={nativeButton ?? render == null}
      disabled={isDisabled || disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isIconOnly && isLoading ? (
        <Spinner />
      ) : (
        <>
          {startIcon && !isLoading && (
            <span data-icon="inline-start" className="inline-flex shrink-0">
              {startIcon}
            </span>
          )}
          {isLoading && (
            <span data-icon="inline-start" className="inline-flex shrink-0">
              <Spinner />
            </span>
          )}
          {children}
          {endIcon && (
            <span data-icon="inline-end" className="inline-flex shrink-0">
              {endIcon}
            </span>
          )}
        </>
      )}
    </ButtonPrimitive>
  )
}
