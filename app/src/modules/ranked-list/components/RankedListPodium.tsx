import { useIntlayer } from 'react-intlayer'
import { Trophy } from 'reicon-react'

import { cn } from '~/common/utils/cn'

import { PODIUM_RANKS, podiumMeta, type PodiumRank } from '../constants/podium'
import type { RankedListEntry } from '../types/ranked-list.types'

interface RankedListPodiumProps {
  items: RankedListEntry[]
}

const byPosition = (items: RankedListEntry[], rank: PodiumRank) => {
  return items.find((item) => item.position === rank)
}

export const RankedListPodium = ({ items }: RankedListPodiumProps) => {
  const content = useIntlayer('podium')
  const getRankLabel = (rank: PodiumRank) => {
    if (rank === 1) return content.first.value
    if (rank === 2) return content.second.value
    return content.third.value
  }

  return (
    <div className="grid grid-cols-3 items-end justify-center gap-2">
      {PODIUM_RANKS.map((rank) => {
        const entry = byPosition(items, rank)
        const meta = podiumMeta[rank]
        const media = entry?.media

        return (
          <div
            key={rank}
            aria-label={getRankLabel(rank)}
            className={cn(
              'group/pedestal relative flex flex-col items-center',
              rank === 1 && 'z-1',
            )}
          >
            <div
              className={cn(
                'relative w-full overflow-hidden rounded-2xl transition-transform duration-300 ease-out',
                meta.heightClass,
                !media && 'border-border bg-muted border border-dashed',
              )}
              style={
                media
                  ? {
                      boxShadow: `0 0 0 2px ${meta.accent}, 0 12px 28px -12px ${meta.accent}`,
                    }
                  : undefined
              }
            >
              {media?.posterUrl ? (
                <img
                  src={media.posterUrl}
                  alt={media.title}
                  className="size-full object-cover"
                  loading="lazy"
                />
              ) : media ? (
                <div
                  className="flex size-full flex-col items-center justify-center gap-1 p-2"
                  style={{ backgroundColor: meta.accentSoft }}
                >
                  <Trophy className="size-5 opacity-80" style={{ color: meta.accent }} />
                  <span className="text-muted-foreground line-clamp-3 text-center text-[10px] leading-tight font-medium">
                    {media.title}
                  </span>
                </div>
              ) : (
                <div className="text-muted-foreground flex size-full flex-col items-center justify-center gap-1">
                  <span className="text-2xl font-semibold tabular-nums opacity-40">{rank}</span>
                  <span className="text-[10px] font-medium tracking-wide uppercase">
                    {content.open.value}
                  </span>
                </div>
              )}

              <div
                className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/70 to-transparent"
                aria-hidden
              />

              <span
                className={cn(
                  'absolute top-1.5 left-1.5 flex size-6 items-center justify-center rounded-full text-[11px] font-bold tabular-nums shadow-sm',
                  media ? 'text-black' : 'bg-muted text-muted-foreground',
                )}
                style={
                  media
                    ? {
                        backgroundColor: meta.accent,
                        color: 'oklch(0.18 0.02 80)',
                      }
                    : undefined
                }
              >
                {rank}
              </span>
            </div>

            {media && (
              <p className="text-foreground mt-1.5 line-clamp-1 w-full text-center text-[11px] font-medium">
                {media.title}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
