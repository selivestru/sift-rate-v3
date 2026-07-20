import { TrailerEmbed } from '../../shared'
import type { MovieVideo } from '../types/movie-detail.types'

interface MovieTrailerProps {
  videos: MovieVideo[]
}

export const MovieTrailer = ({ videos }: MovieTrailerProps) => {
  if (videos.length === 0) return null

  return (
    <section className="flex flex-col gap-3" aria-labelledby="movie-trailer-heading">
      <h2 id="movie-trailer-heading" className="text-foreground text-lg font-semibold">
        Trailer
      </h2>
      <TrailerEmbed videos={videos} />
    </section>
  )
}
