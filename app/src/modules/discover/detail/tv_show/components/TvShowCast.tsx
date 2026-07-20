import { PersonCarousel } from '../../shared'
import type { TvShowPerson } from '../types/tv-show-detail.types'

interface TvShowCastProps {
  cast: TvShowPerson[]
}

export const TvShowCast = ({ cast }: TvShowCastProps) => {
  if (cast.length === 0) return null

  return <PersonCarousel people={cast} title="Cast" titleId="tv-cast-heading" />
}
