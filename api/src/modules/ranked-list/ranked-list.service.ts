import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { UpsertRankedListDto } from './dto/ranked-list.dto'
import { ReorderRankedItemDto } from './dto/reorder-ranked-item.dto'
import { Prisma } from '~/generated/prisma/client'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'

@Injectable()
export class RankedListService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserRankedLists(userId: string) {
    const data = await this.prisma.rankedList.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: {
          orderBy: {
            position: 'asc',
          },
          include: {
            media: true,
          },
        },
      },
    })

    return { data }
  }

  async createList(userId: string, dto: UpsertRankedListDto) {
    return this.prisma.rankedList.create({
      data: {
        title: dto.title,
        userId,
      },
    })
  }

  async updateList(userId: string, listId: string, dto: UpsertRankedListDto) {
    await this.requireOwnedList(userId, listId)

    return this.prisma.rankedList.update({
      where: {
        id: listId,
      },
      data: {
        title: dto.title,
      },
    })
  }

  async deleteList(userId: string, listId: string) {
    await this.requireOwnedList(userId, listId)

    return this.prisma.rankedList.delete({
      where: {
        id: listId,
      },
    })
  }

  async addItem(userId: string, listId: string, mediaId: string) {
    const [media, review] = await Promise.all([
      this.prisma.media.findUnique({
        where: {
          id: mediaId,
        },
      }),
      this.prisma.review.findUnique({
        where: {
          userId_mediaId: {
            userId,
            mediaId,
          },
        },
      }),
    ])

    if (!media) {
      throw new NotFoundException('Media not found')
    }

    if (!review) {
      throw new BadRequestException('Media must be reviewed before adding to a ranked list')
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const list = await this.lockOwnedList(tx, userId, listId)

        if (!list) {
          throw new NotFoundException('List not found')
        }

        const existingItem = await tx.rankedItem.findUnique({
          where: {
            listId_mediaId: {
              listId,
              mediaId,
            },
          },
        })

        if (existingItem) {
          throw new ConflictException('Media is already in this list')
        }

        const maxPosition = await tx.rankedItem.aggregate({
          where: {
            listId,
          },
          _max: {
            position: true,
          },
        })

        return tx.rankedItem.create({
          data: {
            mediaId,
            listId,
            position: (maxPosition._max.position ?? 0) + 1,
          },
          include: {
            media: true,
          },
        })
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Media is already in this list')
      }

      throw error
    }
  }

  async deleteItem(userId: string, listId: string, itemId: string) {
    return this.prisma.$transaction(async (tx) => {
      const list = await this.lockOwnedList(tx, userId, listId)

      if (!list) {
        throw new NotFoundException('List not found')
      }

      const item = await tx.rankedItem.findFirst({
        where: {
          id: itemId,
          listId,
        },
      })

      if (!item) {
        throw new NotFoundException('Item not found')
      }

      await tx.rankedItem.delete({
        where: {
          id: itemId,
        },
      })

      await tx.rankedItem.updateMany({
        where: {
          listId,
          position: {
            gt: item.position,
          },
        },
        data: {
          position: {
            decrement: 1,
          },
        },
      })

      return item
    })
  }

  async reorderItem(userId: string, listId: string, itemId: string, dto: ReorderRankedItemDto) {
    return this.prisma.$transaction(async (tx) => {
      const list = await this.lockOwnedList(tx, userId, listId)

      if (!list) {
        throw new NotFoundException('List not found')
      }

      const item = await tx.rankedItem.findFirst({
        where: {
          id: itemId,
          listId,
        },
      })

      if (!item) {
        throw new NotFoundException('Item not found')
      }

      const itemCount = await tx.rankedItem.count({
        where: {
          listId,
        },
      })

      if (dto.position > itemCount) {
        throw new BadRequestException(`Position must be between 1 and ${itemCount}`)
      }

      const oldPosition = item.position
      const newPosition = dto.position

      if (newPosition === oldPosition) {
        return tx.rankedItem.findUniqueOrThrow({
          where: {
            id: itemId,
          },
          include: {
            media: true,
          },
        })
      }

      if (newPosition < oldPosition) {
        await tx.rankedItem.updateMany({
          where: {
            listId,
            position: {
              gte: newPosition,
              lt: oldPosition,
            },
          },
          data: {
            position: {
              increment: 1,
            },
          },
        })
      } else {
        await tx.rankedItem.updateMany({
          where: {
            listId,
            position: {
              gt: oldPosition,
              lte: newPosition,
            },
          },
          data: {
            position: {
              decrement: 1,
            },
          },
        })
      }

      return tx.rankedItem.update({
        where: {
          id: itemId,
        },
        data: {
          position: newPosition,
        },
        include: {
          media: true,
        },
      })
    })
  }

  private async requireOwnedList(userId: string, listId: string) {
    const list = await this.prisma.rankedList.findFirst({
      where: {
        id: listId,
        userId,
      },
    })

    if (!list) {
      throw new NotFoundException('List not found')
    }

    return list
  }

  private async lockOwnedList(
    tx: Prisma.TransactionClient,
    userId: string,
    listId: string,
  ): Promise<{ id: string } | null> {
    const rows = await tx.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM "RankedList"
      WHERE id = ${listId} AND "userId" = ${userId}
      FOR UPDATE
    `

    return rows[0] ?? null
  }
}
