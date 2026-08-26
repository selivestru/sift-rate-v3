import { useIntlayer } from 'react-intlayer'
import { Inbox } from 'reicon-react'

interface DiscoverSearchEmptyProps {
  query: string
}

export const DiscoverSearchEmpty = ({ query }: DiscoverSearchEmptyProps) => {
  const content = useIntlayer('discover-search-ui')
  return (
    <div className="bg-card border-border flex flex-col items-center justify-center gap-3 rounded-xl border px-6 py-14 text-center">
      <span className="bg-muted text-muted-foreground flex size-11 items-center justify-center rounded-lg">
        <Inbox className="size-5" strokeWidth={1.75} />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-semibold tracking-tight">{content.emptyTitle({ query })}</p>
        <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
          {content.emptyDescription.value}
        </p>
      </div>
    </div>
  )
}
