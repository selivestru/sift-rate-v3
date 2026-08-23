import { Switch as SwitchPrimitive } from '@base-ui/react/switch'

import { cn } from '../utils/cn'

export const Switch = ({
  className,
  size = 'md',
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: 'sm' | 'md' | 'lg'
}) => {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        'peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30 data-[size=md]:h-[18.4px] data-[size=md]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6 data-[size=lg]:h-5.5 data-[size=lg]:w-10 data-checked:bg-primary data-unchecked:bg-input data-disabled:cursor-not-allowed data-disabled:opacity-50 cursor-pointer',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="bg-background dark:data-checked:bg-primary-foreground dark:data-unchecked:bg-foreground pointer-events-none block rounded-full ring-0 transition-transform group-data-[size=lg]/switch:size-5 group-data-[size=md]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=lg]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=md]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=lg]/switch:data-unchecked:translate-x-0 group-data-[size=md]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0"
      />
    </SwitchPrimitive.Root>
  )
}
