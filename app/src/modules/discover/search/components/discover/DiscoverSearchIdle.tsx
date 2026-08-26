import { useIntlayer } from 'react-intlayer'
import { Search } from 'reicon-react'

interface DiscoverSearchIdleProps {
  mediaLabel: string
}

export const DiscoverSearchIdle = ({ mediaLabel }: DiscoverSearchIdleProps) => {
  const content = useIntlayer('discover-search-ui')
  return (
    <div className="bg-card border-border flex flex-col items-center justify-center gap-3 rounded-xl border px-6 py-14 text-center">
      <span className="bg-muted text-muted-foreground flex size-11 items-center justify-center rounded-lg">
        <Search className="size-5" strokeWidth={1.75} />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-semibold tracking-tight">
          {content.searchPrompt({ media: mediaLabel })}
        </p>
        <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
          {content.idleDescription.value}
        </p>
      </div>
    </div>
  )
}
