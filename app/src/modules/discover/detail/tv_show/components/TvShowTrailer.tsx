import { TrailerEmbed } from '../../shared'
import type { TvShowVideo } from '../types/tv-show-detail.types'

interface TvShowTrailerProps {
  videos: TvShowVideo[]
}

export const TvShowTrailer = ({ videos }: TvShowTrailerProps) => {
  if (videos.length === 0) return null

  return (
    <section className="flex flex-col gap-3" aria-labelledby="tv-trailer-heading">
      <h2 id="tv-trailer-heading" className="text-foreground text-lg font-semibold">
        Trailer
      </h2>
      <TrailerEmbed videos={videos} />
    </section>
  )
}
