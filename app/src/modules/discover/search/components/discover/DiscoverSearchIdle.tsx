import { Search } from 'reicon-react'

interface DiscoverSearchIdleProps {
  mediaLabel: string
}

export const DiscoverSearchIdle = ({ mediaLabel }: DiscoverSearchIdleProps) => {
  return (
    <div className="bg-card border-border flex flex-col items-center justify-center gap-3 rounded-xl border px-6 py-14 text-center">
      <span className="bg-muted text-muted-foreground flex size-11 items-center justify-center rounded-lg">
        <Search className="size-5" strokeWidth={1.75} />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-semibold tracking-tight">Search {mediaLabel.toLowerCase()}</p>
        <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
          Type at least 2 characters and press Search to look through the catalog.
        </p>
      </div>
    </div>
  )
}
