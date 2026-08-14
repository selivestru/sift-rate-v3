import type { IconComponent } from 'reicon-react'

import { cn } from '~/common/utils/cn'

interface EmptyStateProps {
  title: string
  icon?: IconComponent
  description?: string
  action?: React.ReactNode
  iconWell?: 'accent' | 'muted'
  className?: string
  border?: boolean
}

export const EmptyState = ({
  title,
  icon: Icon,
  description,
  action,
  iconWell = 'accent',
  className,
  border,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        'bg-card border-transparent flex flex-col items-center gap-4 rounded-xl border px-4 py-14 text-center',
        className,
        border && 'border-border',
      )}
    >
      {Icon && (
        <span
          className={cn(
            'flex size-11 items-center justify-center rounded-lg',
            iconWell === 'accent' ? 'bg-accent text-primary' : 'bg-muted text-muted-foreground',
          )}
        >
          <Icon className="size-5" aria-hidden />
        </span>
      )}
      <div className="flex flex-col gap-1.5">
        <p className="text-foreground font-semibold tracking-tight">{title}</p>
        {description && (
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
