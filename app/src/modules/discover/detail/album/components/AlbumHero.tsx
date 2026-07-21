import { Disc3Icon } from 'lucide-react'

import { MEDIA_TYPES, mediaTypeMeta } from '~/common/constants/media-type'
import { Badge } from '~/common/ui/Badge'
import { formatDate } from '~/common/utils/formatDate'

import { MediaCoverLightbox } from '../../shared'
import { MediaStateButtons } from '../../shared/components/MediaStateButtons'
import type { AlbumDetail } from '../types/album-detail.types'

interface AlbumHeroProps {
  album: AlbumDetail
}

export const AlbumHero = ({ album }: AlbumHeroProps) => {
  const accent = mediaTypeMeta[MEDIA_TYPES.ALBUM].color
  const backdropUrl = album.coverUrl

  const metaParts: string[] = []
  if (album.releaseDate) metaParts.push(formatDate(album.releaseDate))
  if (album.trackCount > 0) {
    metaParts.push(`${album.trackCount} ${album.trackCount === 1 ? 'track' : 'tracks'}`)
  }

  return (
    <div className="relative min-w-0 overflow-hidden rounded-t-2xl">
      <div className="relative min-h-64 sm:min-h-72">
        {backdropUrl ? (
          <>
            <img
              src={backdropUrl}
              alt=""
              aria-hidden
              className="absolute inset-0 size-full scale-105 object-cover object-center"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: [
                  `radial-gradient(ellipse 75% 60% at 75% 25%, color-mix(in oklab, ${accent} 22%, transparent), transparent 58%)`,
                  'linear-gradient(180deg, color-mix(in oklab, var(--background) 8%, transparent) 0%, color-mix(in oklab, var(--background) 28%, transparent) 40%, color-mix(in oklab, var(--background) 78%, transparent) 82%, var(--background) 100%)',
                  'linear-gradient(105deg, color-mix(in oklab, var(--background) 40%, transparent) 0%, transparent 50%)',
                ].join(', '),
              }}
            />
          </>
        ) : (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: [
                `radial-gradient(ellipse 70% 55% at 60% 30%, color-mix(in oklab, ${accent} 26%, transparent), transparent 60%)`,
                `linear-gradient(160deg, color-mix(in oklab, ${accent} 14%, var(--background)), var(--background))`,
              ].join(', '),
            }}
          />
        )}

        <div className="relative z-10 flex min-h-72 flex-col justify-end p-4 sm:min-h-80 sm:p-5">
          <div className="bg-card/75 ring-border/50 flex min-w-0 gap-3 rounded-2xl p-3 shadow-xl ring-1 backdrop-blur-xl sm:gap-4 sm:p-3.5">
            <div className="bg-muted ring-foreground/10 relative size-32 shrink-0 overflow-hidden rounded-xl ring-1 sm:size-48">
              <MediaCoverLightbox
                src={album.coverUrl}
                alt={album.title}
                priority
                width={192}
                height={192}
                imageClassName="object-center"
                fallback={
                  <div className="flex size-full items-center justify-center">
                    <Disc3Icon className="text-muted-foreground size-8" aria-hidden />
                  </div>
                }
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-end gap-1.5 py-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="text-[10px] font-semibold tracking-[0.2em] uppercase"
                  style={{ color: accent }}
                >
                  Album
                </span>
                {album.explicit && (
                  <Badge variant="outline" className="h-5 px-1.5 text-[10px] uppercase">
                    Explicit
                  </Badge>
                )}
              </div>

              <h1 className="text-foreground line-clamp-2 text-xl leading-tight font-bold text-balance sm:text-2xl">
                {album.title}
              </h1>

              <p className="text-foreground truncate text-sm font-medium">{album.artistName}</p>

              {album.label && (
                <p className="text-muted-foreground truncate text-sm text-pretty">{album.label}</p>
              )}

              {metaParts.length > 0 && (
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                  {metaParts.map((part, index) => (
                    <span key={part} className="text-muted-foreground contents text-xs">
                      {index > 0 && (
                        <span className="opacity-40" aria-hidden>
                          ·
                        </span>
                      )}
                      <span className="tabular-nums">{part}</span>
                    </span>
                  ))}
                </div>
              )}

              {album.genres.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {album.genres.slice(0, 4).map((genre) => (
                    <Badge key={genre} variant="outline" className="h-5 px-1.5 text-[10px]">
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}

              <MediaStateButtons
                externalId={album.id}
                mediaType={MEDIA_TYPES.ALBUM}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
