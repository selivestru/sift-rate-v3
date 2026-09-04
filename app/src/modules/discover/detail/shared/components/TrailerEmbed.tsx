import { useState } from 'react'
import ReactPlayer from 'react-player'

import { Button } from '~/common/ui/Button'

import { useYoutubeThumbnail } from '../hooks/useYoutubeThumbnail'
import type { MediaVideo } from '../types/media-detail.types'

interface TrailerEmbedProps {
  videos: MediaVideo[]
}

export const TrailerEmbed = ({ videos }: TrailerEmbedProps) => {
  const [activeId, setActiveId] = useState(() => videos[0]?.id ?? '')
  const active = videos.find((v) => v.id === activeId) ?? videos[0]
  const thumbUrl = useYoutubeThumbnail(active?.key)

  if (videos.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-muted ring-border relative aspect-video overflow-hidden rounded-2xl ring-1">
        <ReactPlayer
          controls
          autoPlay
          light={<img loading="lazy" src={thumbUrl} title={active.name} className="size-full" />}
          src={`https://www.youtube-nocookie.com/embed/${active.key}`}
          title={active.name}
          width="100%"
          height="100%"
        />
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
