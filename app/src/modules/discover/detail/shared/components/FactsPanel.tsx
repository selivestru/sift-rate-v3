import { cn } from '~/common/utils/cn'

export interface FactItem {
  label: string
  value: React.ReactNode
}

interface FactsPanelProps {
  facts: FactItem[]
  className?: string
}

export const FactsPanel = ({ facts, className }: FactsPanelProps) => {
  if (facts.length === 0) return null

  return (
    <dl
      className={cn(
        'flex flex-col divide-y divide-border rounded-2xl bg-card ring-1 ring-border',
        className,
      )}
    >
      {facts.map((fact) => (
        <div
          key={fact.label}
          className="flex items-start justify-between gap-4 px-3.5 py-2.5 sm:px-4"
        >
          <dt className="text-muted-foreground shrink-0 text-xs font-medium tracking-wide uppercase">
            {fact.label}
          </dt>
          <dd className="text-foreground text-right text-sm text-pretty wrap-break-word">
            {fact.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
