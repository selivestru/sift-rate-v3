import { MEDIA_TYPES } from '~/common/constants/media-type'

import { AlbumRail, ContributorList, TrackRail } from '../../shared'
import { MediaReviews } from '../../shared/components/MediaReviews'
import type { TrackDetail } from '../types/track-detail.types'
import { TrackHero } from './TrackHero'

interface TrackDetailViewProps {
  track: TrackDetail
}

export const TrackDetailView = ({ track }: TrackDetailViewProps) => {
  const hasCredits = track.contributors.length > 0
  const hasTopTracks = track.topTracks.length > 0
  const hasArtistAlbums = track.artistAlbums.length > 0

  return (
    <div className="flex max-w-full flex-col overflow-x-clip">
      <TrackHero track={track} />

      <div className="flex flex-col gap-8 p-3 pb-8 md:p-6 md:pb-10">
        {hasCredits && <ContributorList contributors={track.contributors} />}

        {hasTopTracks && (
          <TrackRail
            title={track.artistName ? `More from ${track.artistName}` : 'More from this artist'}
            items={track.topTracks}
          />
        )}

        {hasArtistAlbums && (
          <AlbumRail
            title={track.artistName ? `Albums by ${track.artistName}` : 'More albums'}
            items={track.artistAlbums}
          />
        )}

        <MediaReviews mediaType={MEDIA_TYPES.TRACK} externalId={track.id} />
      </div>
    </div>
  )
}
