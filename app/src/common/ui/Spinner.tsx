import { CircleGraph } from 'reicon-react'

import { cn } from '~/common/utils/cn'

export const Spinner = ({ className, ...props }: React.ComponentProps<'svg'>) => {
  return (
    <CircleGraph
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  )
}
