import { cn } from '~/common/utils/cn'

type SettingsSectionProps = {
  title: string
  description?: string
  className?: string
  children: React.ReactNode
  footer?: React.ReactNode
  tone?: 'default' | 'destructive'
}

export const SettingsSection = ({
  title,
  description,
  className,
  children,
  footer,
  tone = 'default',
}: SettingsSectionProps) => {
  return (
    <section className={cn('border-border bg-card overflow-hidden rounded-xl border', className)}>
      <div className="border-border flex flex-col gap-1 border-b px-4 py-4 sm:px-5">
        <h2
          className={cn(
            'text-base font-semibold tracking-tight',
            tone === 'destructive' && 'text-destructive',
          )}
        >
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        )}
      </div>
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-5">{children}</div>
      {footer && (
        <div className="border-border bg-muted flex items-center justify-end border-t px-4 py-3 sm:px-5">
          {footer}
        </div>
      )}
    </section>
  )
}
