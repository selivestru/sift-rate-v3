export const RankingListError = () => {
  return (
    <div
      role="alert"
      className="bg-card border-border text-destructive flex flex-col items-center gap-3 rounded-xl border px-4 py-8 text-center"
    >
      <p className="text-sm font-medium">Couldn&apos;t load your ranked lists.</p>
      <p className="text-muted-foreground max-w-sm text-xs leading-relaxed">
        Couldn&apos;t load your rankings. Try again later.
      </p>
    </div>
  )
}
