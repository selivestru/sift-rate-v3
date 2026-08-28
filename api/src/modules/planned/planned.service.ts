import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'

import { MediaService } from '../media/media.service'
import { AddPlannedItemDto } from './dto/planned.dto'
import { PlannedItemsResponse } from './types/planned.types'
import { PlannedItem } from '~/generated/prisma/client'
import { MediaLanguage } from '~/generated/prisma/enums'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'

@Injectable()
export class PlannedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  async getPlannedItems(userId: string, language: MediaLanguage): Promise<PlannedItemsResponse> {
    const items = await this.prisma.plannedItem.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: { media: true },
    })

    const data = await this.mediaService.localizeMediaRelations(items, language)

    return {
      data,
      totalResults: data.length,
    }
  }

  async addPlannedItem(
    userId: string,
    body: AddPlannedItemDto,
    language: MediaLanguage,
  ): Promise<PlannedItem> {
    const media = await this.mediaService.ensureMedia(body.mediaType, body.externalId)

    const item = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.plannedItem.findUnique({
        where: {
          userId_mediaId: {
            userId,
            mediaId: media.id,
          },
        },
      })

      if (existing) {
        throw new ConflictException('Planned item already exists')
      }

      return tx.plannedItem.create({
        data: {
          mediaId: media.id,
          userId,
        },
        include: { media: true },
      })
    })

    return this.mediaService.localizeMediaRelations(item, language)
  }

  async deletePlannedItem(
    userId: string,
    id: string,
    language: MediaLanguage,
  ): Promise<PlannedItem> {
    const existing = await this.prisma.plannedItem.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!existing) {
      throw new NotFoundException('Planned item not found')
    }

    const item = await this.prisma.plannedItem.delete({
      where: {
        id,
      },
      include: { media: true },
    })

    return this.mediaService.localizeMediaRelations(item, language)
  }
}
