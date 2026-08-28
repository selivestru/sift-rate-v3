import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'

import { AddPlannedItemDto } from './dto/planned.dto'
import { PlannedService } from './planned.service'
import { CurrentLanguage } from '~/common/decorators/current-language.decorator'
import { CurrentUser } from '~/common/decorators/current-user.decorator'
import { MediaLanguage } from '~/generated/prisma/enums'

@Controller('planned')
export class PlannedController {
  constructor(private readonly plannedService: PlannedService) {}

  @Get()
  getPlannedItems(
    @CurrentUser('userId') userId: string,
    @CurrentLanguage() language: MediaLanguage,
  ) {
    return this.plannedService.getPlannedItems(userId, language)
  }

  @Post()
  addPlannedItem(
    @CurrentUser('userId') userId: string,
    @Body() body: AddPlannedItemDto,
    @CurrentLanguage() language: MediaLanguage,
  ) {
    return this.plannedService.addPlannedItem(userId, body, language)
  }

  @Delete(':id')
  deletePlannedItem(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @CurrentLanguage() language: MediaLanguage,
  ) {
    return this.plannedService.deletePlannedItem(userId, id, language)
  }
}
