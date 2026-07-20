import { MediaImageGallery } from '../../shared'
import type { MovieImage } from '../types/movie-detail.types'

interface MovieGalleryProps {
  title: string
  backdrops: MovieImage[]
  posters: MovieImage[]
}

export const MovieGallery = ({ title, backdrops, posters }: MovieGalleryProps) => {
  if (backdrops.length === 0 && posters.length === 0) return null

  return <MediaImageGallery title={title} backdrops={backdrops} posters={posters} />
}
