import { mediaTypeList } from '~/common/constants/media-type'
import { reviewsNavItem } from '~/common/constants/navigation'
import { Skeleton } from '~/common/ui/Skeleton'
import { cn } from '~/common/utils/cn'

interface ReviewListHeroProps {
  totalResults: number
  isLoading?: boolean
}

const SCORE_BARS = [
  { id: 's1', height: 'h-3', opacity: 0.4 },
  { id: 's2', height: 'h-4', opacity: 0.55 },
  { id: 's3', height: 'h-5', opacity: 0.7 },
  { id: 's4', height: 'h-6', opacity: 0.85 },
  { id: 's5', height: 'h-7', opacity: 1 },
] as const

export const ReviewListHero = ({ totalResults, isLoading = false }: ReviewListHeroProps) => {
  const { color, icon: ReviewsIcon } = reviewsNavItem
  const isEmpty = !isLoading && totalResults === 0

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden rounded-4xl',
        'bg-card ring-1 ring-border/50',
        'px-5 py-6 sm:px-7 sm:py-8',
      )}
      style={{ ['--reviews-accent' as string]: color }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: [
            'radial-gradient(ellipse 95% 85% at 0% 0%, color-mix(in oklab, var(--reviews-accent) 22%, transparent), transparent 64%)',
            'radial-gradient(ellipse 65% 70% at 100% 100%, color-mix(in oklab, var(--reviews-accent) 14%, transparent), transparent 60%)',
            'radial-gradient(ellipse 40% 45% at 72% 18%, color-mix(in oklab, var(--reviews-accent) 10%, transparent), transparent 55%)',
          ].join(', '),
        }}
      />

      <ReviewsIcon
        className="pointer-events-none absolute -right-6 -bottom-8 size-44 opacity-[0.06] sm:size-56"
        aria-hidden
        style={{ color }}
      />

      <div className="relative flex flex-col gap-8 sm:flex-row sm:justify-between sm:gap-10">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <p className="text-muted-foreground text-[11px] font-medium tracking-[0.18em] uppercase">
            Library
          </p>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Reviews</h1>
            <p className="text-muted-foreground max-w-[36ch] text-sm leading-relaxed sm:text-[15px]">
              Ratings and notes that map what you watch, read, play, and hear.
            </p>
          </div>
        </div>

        <div
          className="flex shrink-0 flex-col items-start gap-3 sm:items-end"
          aria-label={
            isLoading ? 'Loading review count' : `${totalResults} reviews logged in your archive`
          }
        >
          <div className="flex flex-col items-start gap-0.5 sm:items-end sm:text-right">
            {isLoading ? (
              <Skeleton className="h-12 w-16 rounded-xl sm:h-14 sm:w-20" />
            ) : (
              <p
                className={cn(
                  'text-5xl font-semibold tracking-tighter tabular-nums sm:text-6xl',
                  isEmpty && 'text-muted-foreground/45',
                )}
                style={!isEmpty ? { color } : undefined}
              >
                {totalResults}
              </p>
            )}
            <p className="text-muted-foreground text-xs font-medium tracking-wide sm:text-sm">
              reviews logged
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-7 flex items-center gap-2 sm:mt-9" aria-hidden>
        <div className="bg-border/60 h-px flex-1" />
        <div className="flex items-center gap-1.5 px-1">
          {mediaTypeList.map((item) => (
            <span
              key={item.type}
              className="size-1.5 rounded-full sm:size-2"
              style={{
                backgroundColor: item.color,
                boxShadow: `0 0 10px color-mix(in oklab, ${item.color} 55%, transparent)`,
              }}
            />
          ))}
        </div>
        <div className="bg-border/60 h-px flex-1" />
      </div>
    </div>
  )
}
