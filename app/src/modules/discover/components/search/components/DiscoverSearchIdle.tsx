import { SearchIcon } from 'lucide-react'

interface DiscoverSearchIdleProps {
  mediaLabel: string
}

export const DiscoverSearchIdle = ({ mediaLabel }: DiscoverSearchIdleProps) => {
  return (
    <div className="border-border/60 bg-surface/30 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-14 text-center">
      <span className="bg-foreground/5 text-muted flex size-11 items-center justify-center rounded-2xl">
        <SearchIcon className="size-5" strokeWidth={1.75} />
      </span>
      <div className="space-y-1">
        <p className="text-foreground text-sm font-medium tracking-tight">
          Search {mediaLabel.toLowerCase()}
        </p>
        <p className="text-muted max-w-xs text-sm leading-relaxed">
          Type at least 2 characters and press Search to look through the catalog.
        </p>
      </div>
    </div>
  )
}
