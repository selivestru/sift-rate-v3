import { MediaImageGallery } from '../../shared'
import type { TvShowImage } from '../types/tv-show-detail.types'

interface TvShowGalleryProps {
  title: string
  backdrops: TvShowImage[]
  posters: TvShowImage[]
}

export const TvShowGallery = ({ title, backdrops, posters }: TvShowGalleryProps) => {
  if (backdrops.length === 0 && posters.length === 0) return null

  return <MediaImageGallery title={title} backdrops={backdrops} posters={posters} />
}
