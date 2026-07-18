import { InboxIcon } from 'lucide-react'

interface DiscoverSearchEmptyProps {
  query: string
}

export const DiscoverSearchEmpty = ({ query }: DiscoverSearchEmptyProps) => {
  return (
    <div className="border-border/60 bg-surface/30 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-14 text-center">
      <span className="bg-foreground/5 text-muted-foreground flex size-11 items-center justify-center rounded-2xl">
        <InboxIcon className="size-5" strokeWidth={1.75} />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-medium tracking-tight">No results for “{query}”</p>
        <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
          Try a different spelling, a shorter title, or another keyword.
        </p>
      </div>
    </div>
  )
}
