import { Messages } from 'reicon-react'

export const FeedEmptyState = () => {
  return (
    <div className="bg-card border-border flex flex-col items-center rounded-xl border px-4 py-12 text-center">
      <div className="bg-muted text-muted-foreground mb-3 flex size-10 items-center justify-center rounded-full">
        <Messages className="size-5" />
      </div>
      <h3 className="font-semibold tracking-tight">No activity yet</h3>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm">
        Reviews and posts will appear here as they become part of the archive.
      </p>
    </div>
  )
}
