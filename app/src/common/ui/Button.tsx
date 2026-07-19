import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { Spinner } from '~/common/ui/Spinner'
import { cn } from '~/common/utils/cn'

export const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-3xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:not-aria-[haspopup]:scale-[102%] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-[3px] aria-invalid:ring-danger/20 dark:aria-invalid:border-danger/50 dark:aria-invalid:ring-danger/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 gap-2",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary-hover aria-expanded:bg-secondary',
        danger:
          'bg-danger text-danger-foreground hover:bg-danger-hover focus-visible:border-danger/40 focus-visible:ring-danger/20',
        'danger-soft':
          'bg-danger-soft text-danger-soft-foreground hover:bg-danger-soft-hover focus-visible:border-danger/40 focus-visible:ring-danger/20',
        outline:
          'border-border bg-input/30 hover:bg-input/50 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground',
        ghost:
          'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
        success:
          'bg-success text-success-foreground hover:bg-success-hover focus-visible:border-success/40 focus-visible:ring-success/20',
      },
      size: {
        default: 'h-10 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5',
        xs: "h-7 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-9 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        lg: 'h-11.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
        icon: 'size-10',
        'icon-xs': "size-7 [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-9',
        'icon-lg': 'size-11',
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

type ButtonProps = Omit<ButtonPrimitive.Props, 'disabled'> &
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
        fullWidth ? 'w-full' : 'w-fit',
        className,
      )}
      render={render}
      nativeButton={nativeButton ?? render == null}
      disabled={isDisabled || isLoading}
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
