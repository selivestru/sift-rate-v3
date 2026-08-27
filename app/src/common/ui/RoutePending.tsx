import { Spinner } from './Spinner'

export const RoutePending = () => {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center px-4 py-14"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="bg-card border-border flex flex-col items-center gap-4 rounded-xl border px-8 py-10">
        <Spinner className="text-muted-foreground size-8" />
        <p className="text-muted-foreground text-sm">Loading…</p>
      </div>
    </div>
  )
}
