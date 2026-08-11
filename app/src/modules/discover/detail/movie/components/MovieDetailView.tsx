import { MEDIA_TYPES } from '~/common/constants/media-type'

import { MediaReviews } from '../../shared/components/MediaReviews'
import type { MovieDetail } from '../types/movie-detail.types'
import { MovieCast } from './MovieCast'
import { MovieCrewAndFacts } from './MovieCrewAndFacts'
import { MovieGallery } from './MovieGallery'
import { MovieHero } from './MovieHero'
import { MovieSimilar } from './MovieSimilar'
import { MovieTrailer } from './MovieTrailer'

interface MovieDetailViewProps {
  movie: MovieDetail
}

export const MovieDetailView = ({ movie }: MovieDetailViewProps) => {
  const hasCast = movie.cast.length > 0
  const hasVideos = movie.videos.length > 0
  const hasGallery = movie.backdrops.length > 0 || movie.posters.length > 0
  const hasSimilar = movie.similar.length > 0
  const hasCrewOrFacts =
    movie.directors.length > 0 ||
    movie.writers.length > 0 ||
    movie.producers.length > 0 ||
    Boolean(movie.releaseDate) ||
    Boolean(movie.runtimeMinutes) ||
    movie.languages.length > 0 ||
    movie.countries.length > 0 ||
    movie.studios.length > 0 ||
    movie.budget != null ||
    movie.revenue != null

  return (
    <div className="flex max-w-full flex-col overflow-x-clip">
      <MovieHero movie={movie} />

      <div className="flex flex-col gap-8 p-3 pb-8 md:p-6 md:pb-10">
        {hasCrewOrFacts && <MovieCrewAndFacts movie={movie} />}

        {hasCast && <MovieCast cast={movie.cast} />}

        {hasVideos && <MovieTrailer videos={movie.videos} />}

        {hasGallery && (
          <MovieGallery title={movie.title} backdrops={movie.backdrops} posters={movie.posters} />
        )}

        {hasSimilar && <MovieSimilar items={movie.similar} />}

        <MediaReviews mediaType={MEDIA_TYPES.MOVIE} externalId={movie.id} />
      </div>
    </div>
  )
}
