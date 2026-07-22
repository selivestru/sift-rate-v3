export const RankingListError = () => {
  return (
    <div
      role="alert"
      className="bg-danger/10 border-danger/20 text-danger flex flex-col items-center gap-3 rounded-2xl border px-4 py-8 text-center"
    >
      <p className="text-sm font-medium">Couldn&apos;t load your ranked lists.</p>
      <p className="text-danger/80 max-w-sm text-xs leading-relaxed">
        Couldn&apos;t load your rankings. Try again later.
      </p>
    </div>
  )
}
