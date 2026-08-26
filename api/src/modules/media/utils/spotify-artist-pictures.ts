import type { MediaCacheService } from '../services/media-cache.service'
import type { SpotifyImage } from '../services/spotify-client.service'

const ARTIST_PICTURE_CACHE_TTL_SECONDS = 24 * 3600

interface SpotifyArtistRaw {
  id: string
  images?: SpotifyImage[]
}

const artistImageCacheKey = (artistId: string) => `spotify:artist-img:${artistId}`

export const fetchArtistPictures = async (
  spotify: { get<T>(path: string): Promise<T> },
  cache: Pick<MediaCacheService, 'get' | 'set'>,
  ids: string[],
): Promise<Map<string, string | null>> => {
  const result = new Map<string, string | null>()
  const uniqueIds = [...new Set(ids.filter(Boolean))]

  await Promise.all(
    uniqueIds.map(async (id) => {
      const cached = await cache.get<string | null>(artistImageCacheKey(id))
      if (cached !== undefined) {
        result.set(id, cached)
        return
      }

      try {
        const artist = await spotify.get<SpotifyArtistRaw>(`/artists/${id}`)
        const image = pickImage(artist.images)

        result.set(id, image)

        if (image) {
          await cache.set(artistImageCacheKey(id), image, ARTIST_PICTURE_CACHE_TTL_SECONDS)
        }
      } catch {
        result.set(id, null)
      }
    }),
  )

  return result
}

const pickImage = (images: SpotifyImage[] | null | undefined): string | null =>
  images?.find((image) => image.width === 640)?.url ?? images?.[0]?.url ?? null
