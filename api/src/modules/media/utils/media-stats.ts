import { MediaRatingBreakdownItem } from '../types/movie.types'
import { MediaType } from '~/generated/prisma/enums'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'

export const getRatingBreakdown = async (
  prisma: PrismaService,
  mediaType: MediaType,
  externalId: string,
): Promise<MediaRatingBreakdownItem[]> => {
  const groups = await prisma.review.groupBy({
    by: ['rating'],
    where: {
      media: {
        externalId,
        mediaType,
      },
    },
    _count: true,
  })

  return groups
    .map((group) => ({
      rating: group.rating,
      count: group._count,
    }))
    .sort((a, b) => a.rating - b.rating)
}
