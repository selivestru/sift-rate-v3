import type { IconComponent } from 'reicon-react'

import { cn } from '~/common/utils/cn'

type PageHeaderProps = {
  icon: IconComponent
  label: string
  title: string
  description?: string
  iconColor?: string
  iconWell?: 'accent' | 'muted'
  className?: string
  children?: React.ReactNode
}

export const PageHeader = ({
  icon: Icon,
  label,
  title,
  description,
  iconColor,
  iconWell = 'accent',
  className,
  children,
}: PageHeaderProps) => {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            'flex size-9 items-center justify-center rounded-lg',
            iconWell === 'accent' ? 'bg-accent text-primary' : 'bg-muted',
          )}
        >
          <Icon
            className="size-4"
            strokeWidth={1.75}
            style={iconColor !== undefined ? { color: iconColor } : undefined}
          />
        </span>
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</p>
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{title}</h1>
      {description && (
        <p className="text-muted-foreground text-sm leading-relaxed text-pretty">{description}</p>
      )}
      {children}
    </div>
  )
}
