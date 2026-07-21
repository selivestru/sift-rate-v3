import { MEDIA_TYPES } from '~/common/constants/media-type'

import { MediaReviews } from '../../shared/components/MediaReviews'
import type { TvShowDetail } from '../types/tv-show-detail.types'
import { TvShowCast } from './TvShowCast'
import { TvShowFacts } from './TvShowFacts'
import { TvShowGallery } from './TvShowGallery'
import { TvShowHero } from './TvShowHero'
import { TvShowSeasons } from './TvShowSeasons'
import { TvShowSimilar } from './TvShowSimilar'
import { TvShowTrailer } from './TvShowTrailer'

interface TvShowDetailViewProps {
  show: TvShowDetail
}

export const TvShowDetailView = ({ show }: TvShowDetailViewProps) => {
  const hasCast = show.cast.length > 0
  const hasVideos = show.videos.length > 0
  const hasGallery = show.backdrops.length > 0 || show.posters.length > 0
  const hasSimilar = show.similar.length > 0
  const hasFacts =
    Boolean(show.firstAirDate) ||
    Boolean(show.lastAirDate) ||
    Boolean(show.status) ||
    Boolean(show.type) ||
    show.networks.length > 0 ||
    show.languages.length > 0 ||
    show.countries.length > 0 ||
    show.studios.length > 0 ||
    show.createdBy.length > 0 ||
    show.seasonCount > 0 ||
    show.episodeCount > 0 ||
    show.episodeRunTimeMinutes != null

  return (
    <div className="flex max-w-full min-w-0 flex-col overflow-x-clip">
      <TvShowHero show={show} />

      <div className="flex min-w-0 flex-col gap-8 p-3 pb-8 md:p-6 md:pb-10">
        <TvShowSeasons seasons={show.seasons} />

        {hasCast && <TvShowCast cast={show.cast} />}

        {hasFacts && <TvShowFacts show={show} />}

        {hasVideos && <TvShowTrailer videos={show.videos} />}

        {hasGallery && (
          <TvShowGallery title={show.title} backdrops={show.backdrops} posters={show.posters} />
        )}

        {hasSimilar && <TvShowSimilar items={show.similar} />}

        <MediaReviews mediaType={MEDIA_TYPES.TV_SHOW} externalId={show.id} />
      </div>
    </div>
  )
}
