import { TrailerEmbed } from '../../shared'
import type { GameVideo } from '../types/game-detail.types'

interface GameVideosProps {
  videos: GameVideo[]
}

export const GameVideos = ({ videos }: GameVideosProps) => {
  if (videos.length === 0) return null

  return (
    <section className="flex flex-col gap-3" aria-labelledby="game-videos-heading">
      <h2 id="game-videos-heading" className="text-foreground text-lg font-semibold">
        Trailer
      </h2>
      <TrailerEmbed videos={videos} />
    </section>
  )
}
