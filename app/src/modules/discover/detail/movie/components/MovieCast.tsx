import { PersonCarousel } from '../../shared'
import type { MoviePerson } from '../types/movie-detail.types'

interface MovieCastProps {
  cast: MoviePerson[]
}

export const MovieCast = ({ cast }: MovieCastProps) => {
  if (cast.length === 0) return null

  return <PersonCarousel people={cast} title="Cast" titleId="movie-cast-heading" />
}
