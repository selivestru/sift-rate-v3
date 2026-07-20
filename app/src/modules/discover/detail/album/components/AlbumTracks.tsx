import { ChevronDownIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '~/common/ui/Button'

import type { AlbumTrack } from '../types/album-detail.types'
import { AlbumTrackRow } from './AlbumTrackRow'

const ALBUM_TRACKS_PREVIEW = 8

interface AlbumTracksProps {
  tracks: AlbumTrack[]
  coverUrl?: string | null
}

export const AlbumTracks = ({ tracks, coverUrl }: AlbumTracksProps) => {
  const [expanded, setExpanded] = useState(false)
  const total = tracks.length
  const needsExpand = total > ALBUM_TRACKS_PREVIEW
  const visibleTracks = expanded ? tracks : tracks.slice(0, ALBUM_TRACKS_PREVIEW)

  if (total === 0) {
    return (
      <section className="flex flex-col gap-4" aria-labelledby="album-tracks-heading">
        <h2 id="album-tracks-heading" className="text-foreground text-lg font-semibold">
          Tracks
        </h2>
        <p className="text-muted-foreground text-sm">No tracks available for this album.</p>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-4" aria-labelledby="album-tracks-heading">
      <div className="flex items-center gap-2">
        <h2 id="album-tracks-heading" className="text-foreground text-lg font-semibold">
          Tracks
        </h2>
        <span className="text-muted-foreground text-sm tabular-nums">{total}</span>
      </div>

      <div className="flex flex-col gap-2">
        {visibleTracks.map((track, index) => (
          <AlbumTrackRow key={track.id} track={track} index={index} coverUrl={coverUrl} />
        ))}
      </div>

      {needsExpand && !expanded && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="self-start"
          onClick={() => setExpanded(true)}
          endIcon={<ChevronDownIcon className="size-4" />}
        >
          {`Show all ${total} tracks`}
        </Button>
      )}
    </section>
  )
}
