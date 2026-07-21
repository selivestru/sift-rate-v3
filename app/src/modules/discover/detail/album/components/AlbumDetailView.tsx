import { MEDIA_TYPES } from '~/common/constants/media-type'

import { AlbumRail, ContributorList, TrackRail } from '../../shared'
import { MediaReviews } from '../../shared/components/MediaReviews'
import type { AlbumDetail } from '../types/album-detail.types'
import { AlbumHero } from './AlbumHero'
import { AlbumTracks } from './AlbumTracks'

interface AlbumDetailViewProps {
  album: AlbumDetail
}

export const AlbumDetailView = ({ album }: AlbumDetailViewProps) => {
  const hasCredits = album.contributors.length > 0
  const hasArtistAlbums = album.artistAlbums.length > 0
  const hasTopTracks = album.topTracks.length > 0

  return (
    <div className="flex max-w-full min-w-0 flex-col overflow-x-clip">
      <AlbumHero album={album} />

      <div className="flex min-w-0 flex-col gap-8 p-3 pb-8 md:p-6 md:pb-10">
        <AlbumTracks tracks={album.tracks} coverUrl={album.coverUrl} />

        {hasCredits && <ContributorList contributors={album.contributors} />}

        {hasArtistAlbums && (
          <AlbumRail
            title={album.artistName ? `More by ${album.artistName}` : 'More albums'}
            items={album.artistAlbums}
          />
        )}

        {hasTopTracks && (
          <TrackRail
            title={album.artistName ? `Popular by ${album.artistName}` : 'Popular tracks'}
            items={album.topTracks}
          />
        )}

        <MediaReviews mediaType={MEDIA_TYPES.TV_SHOW} externalId={album.id} />
      </div>
    </div>
  )
}
