import { useState } from 'react'
import { useIntlayer } from 'react-intlayer'
import { Play } from 'reicon-react'

import { Button } from '~/common/ui/Button'
import { cn } from '~/common/utils/cn'

import type { MediaVideo } from '../types/media-detail.types'

interface TrailerEmbedProps {
  videos: MediaVideo[]
  className?: string
}

export const TrailerEmbed = ({ videos, className }: TrailerEmbedProps) => {
  const content = useIntlayer('discover-detail')
  const [activeId, setActiveId] = useState(() => videos[0]?.id ?? '')
  const [playing, setPlaying] = useState(false)

  if (videos.length === 0) return null

  const active = videos.find((v) => v.id === activeId) ?? videos[0]
  const thumbUrl = `https://i.ytimg.com/vi/${active.key}/hqdefault.jpg`

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="bg-muted ring-border relative aspect-video w-full overflow-hidden rounded-2xl ring-1">
        <div key={`${active.id}-${playing ? 'play' : 'idle'}`} className="size-full">
          {playing ? (
            <iframe
              sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
              title={active.name}
              src={`https://www.youtube-nocookie.com/embed/${active.key}?autoplay=1&rel=0`}
              className="size-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group relative size-full cursor-pointer"
              aria-label={content.playTrailer({ name: active.name })}
            >
              <img
                src={thumbUrl}
                alt=""
                aria-hidden
                className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/30" />
              <span className="bg-card text-foreground ring-border absolute top-1/2 left-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-lg ring-1 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
                <Play className="size-6 fill-current" aria-hidden />
              </span>
            </button>
          )}
        </div>
      </div>

      {videos.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {videos.map((video) => {
            const isActive = video.id === active.id
            return (
              <Button
                key={video.id}
                type="button"
                size="xs"
                variant={isActive ? 'secondary' : 'outline'}
                onClick={() => {
                  setActiveId(video.id)
                  setPlaying(false)
                }}
              >
                {video.name}
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )
}
