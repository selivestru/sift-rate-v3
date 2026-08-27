import { Select as SelectPrimitive } from '@base-ui/react/select'
import { cva, type VariantProps } from 'class-variance-authority'
import { Check, ChevronDown, ChevronUp } from 'reicon-react'

import { cn } from '~/common/utils/cn'

export const Select = <Value, Multiple extends boolean | undefined = false>(
  props: SelectPrimitive.Root.Props<Value, Multiple>,
) => {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

export const selectTriggerVariants = cva(
  "flex w-full items-center justify-between gap-1.5 rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 data-placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-secondary text-foreground hover:bg-accent focus-visible:bg-secondary',
        outline:
          'border-input bg-background text-foreground hover:bg-accent focus-visible:bg-background',
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

export const SelectTrigger = ({
  className,
  variant,
  size,
  isInvalid = false,
  children,
  ...props
}: SelectPrimitive.Trigger.Props &
  VariantProps<typeof selectTriggerVariants> & {
    isInvalid?: boolean
  }) => {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(selectTriggerVariants({ variant, size }), className)}
      aria-invalid={isInvalid || undefined}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        data-slot="select-icon"
        className="text-muted-foreground inline-flex shrink-0"
      >
        <ChevronDown />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

export const SelectValue = ({ className, ...props }: SelectPrimitive.Value.Props) => {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn('flex flex-1 text-left', className)}
      {...props}
    />
  )
}

export const SelectContent = ({
  className,
  children,
  side = 'bottom',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset' | 'alignItemWithTrigger'
  >) => {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        className="isolate z-50 outline-none"
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger || undefined}
          className={cn(
            'z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg duration-150 outline-none data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95',
            className,
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List className="flex flex-col gap-0.5 outline-none">
            {children}
          </SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

export const SelectGroup = ({ className, ...props }: SelectPrimitive.Group.Props) => {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn('scroll-my-1', className)}
      {...props}
    />
  )
}

export const SelectLabel = ({ className, ...props }: SelectPrimitive.GroupLabel.Props) => {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn('px-3 py-2 text-xs text-muted-foreground', className)}
      {...props}
    />
  )
}

export const SelectItem = ({ className, children, ...props }: SelectPrimitive.Item.Props) => {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'relative flex w-full cursor-pointer items-center gap-2.5 rounded-md py-2 pr-8 pl-3 text-sm outline-hidden select-none transition-colors duration-150 data-highlighted:bg-accent data-disabled:pointer-events-none data-disabled:opacity-50 data-disabled:bg-muted [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 items-center gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        data-slot="select-item-indicator"
        className="pointer-events-none absolute right-2 flex size-4 items-center justify-center"
      >
        <Check />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

export const SelectSeparator = ({ className, ...props }: SelectPrimitive.Separator.Props) => {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('pointer-events-none -mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  )
}

export const SelectScrollUpButton = ({
  className,
  ...props
}: SelectPrimitive.ScrollUpArrow.Props) => {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        'top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 text-muted-foreground [&_svg:not([class*="size-"])]:size-4',
        className,
      )}
      {...props}
    >
      <ChevronUp />
    </SelectPrimitive.ScrollUpArrow>
  )
}

export const SelectScrollDownButton = ({
  className,
  ...props
}: SelectPrimitive.ScrollDownArrow.Props) => {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        'bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 text-muted-foreground [&_svg:not([class*="size-"])]:size-4',
        className,
      )}
      {...props}
    >
      <ChevronDown />
    </SelectPrimitive.ScrollDownArrow>
  )
}
