import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'

import { MediaService } from '../media/media.service'
import { AddPlannedItemDto } from './dto/planned.dto'
import { PlannedItemsResponse } from './types/planned.types'
import { PlannedItem } from '~/generated/prisma/client'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'

@Injectable()
export class PlannedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  async getPlannedItems(userId: string): Promise<PlannedItemsResponse> {
    const items = await this.prisma.plannedItem.findMany({
      where: {
        userId,
      },
      include: { media: true },
    })

    return {
      data: items,
      totalResults: items.length,
    }
  }

  async addPlannedItem(userId: string, body: AddPlannedItemDto): Promise<PlannedItem> {
    const media = await this.mediaService.ensureMedia(body.mediaType, body.externalId)

    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.plannedItem.findFirst({
        where: {
          mediaId: media.id,
          userId,
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
  }

  async deletePlannedItem(userId: string, id: string): Promise<PlannedItem> {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.plannedItem.findFirst({
        where: {
          id,
          userId,
        },
      })

      if (!existing) {
        throw new NotFoundException('Planned item not found')
      }

      return tx.plannedItem.delete({
        where: {
          userId,
          id,
        },
        include: { media: true },
      })
    })
  }
}
