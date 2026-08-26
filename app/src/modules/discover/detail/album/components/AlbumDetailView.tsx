import { useIntlayer } from 'react-intlayer'

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
  const content = useIntlayer('discover-detail')
  const hasCredits = album.contributors.length > 0
  const hasArtistAlbums = album.artistAlbums.length > 0
  const hasTopTracks = album.topTracks.length > 0

  return (
    <div className="flex max-w-full flex-col overflow-x-clip">
      <AlbumHero album={album} />

      <div className="flex flex-col gap-8 p-3 pb-8 md:p-6 md:pb-10">
        <AlbumTracks tracks={album.tracks} coverUrl={album.coverUrl} />

        {hasCredits && <ContributorList contributors={album.contributors} />}

        {hasArtistAlbums && (
          <AlbumRail
            title={
              album.artistName
                ? content.moreBy({ author: album.artistName })
                : content.moreAlbums.value
            }
            items={album.artistAlbums}
          />
        )}

        {hasTopTracks && (
          <TrackRail
            title={
              album.artistName
                ? content.popularBy({ artist: album.artistName })
                : content.popularTracks.value
            }
            items={album.topTracks}
          />
        )}

        <MediaReviews mediaType={MEDIA_TYPES.TV_SHOW} externalId={album.id} />
      </div>
    </div>
  )
}
