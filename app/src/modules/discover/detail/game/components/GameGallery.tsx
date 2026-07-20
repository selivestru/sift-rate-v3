import { MediaImageGallery } from '../../shared'
import type { GameImage } from '../types/game-detail.types'

interface GameGalleryProps {
  title: string
  screenshots: GameImage[]
  artworks: GameImage[]
}

export const GameGallery = ({ title, screenshots, artworks }: GameGalleryProps) => {
  if (screenshots.length === 0 && artworks.length === 0) return null

  return (
    <MediaImageGallery
      title={title}
      backdrops={screenshots}
      posters={artworks}
      backdropLabel="Screenshots"
      posterLabel="Artworks"
      posterAspect="landscape"
      backdropAspect="landscape"
      preferBackdrops
    />
  )
}
