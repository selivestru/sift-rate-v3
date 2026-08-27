import { Slider as SliderPrimitive } from '@base-ui/react/slider'

import { cn } from '~/common/utils/cn'

export const Slider = ({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  isDisabled = false,
  disabled = false,
  thumbAriaLabel,
  ...props
}: SliderPrimitive.Root.Props & {
  isDisabled?: boolean
  thumbAriaLabel?: string
}) => {
  const resolvedDisabled = isDisabled || disabled

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn('data-horizontal:w-full data-vertical:h-full', className)}
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      disabled={resolvedDisabled}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="bg-muted relative grow overflow-hidden rounded-full select-none data-horizontal:h-1.5 data-horizontal:w-full data-vertical:h-full data-vertical:w-1.5"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-primary select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          aria-label={thumbAriaLabel}
          className="border-primary bg-background ring-ring/40 block size-4 shrink-0 rounded-full border shadow-sm transition-colors select-none hover:ring-2 focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        />
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}
