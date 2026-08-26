import { useIntlayer } from 'react-intlayer'

export const RankingListError = () => {
  const content = useIntlayer('ranking-list-error')

  return (
    <div
      role="alert"
      className="bg-card border-border text-destructive flex flex-col items-center gap-3 rounded-xl border px-4 py-8 text-center"
    >
      <p className="text-sm font-medium">{content.title.value}</p>
      <p className="text-muted-foreground max-w-sm text-xs leading-relaxed">
        {content.description.value}
      </p>
    </div>
  )
}
