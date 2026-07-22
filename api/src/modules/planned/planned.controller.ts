import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'

import { AddPlannedItemDto } from './dto/planned.dto'
import { PlannedService } from './planned.service'
import { CurrentUser } from '~/common/decorators/current-user.decorator'

@Controller('planned')
export class PlannedController {
  constructor(private readonly plannedService: PlannedService) {}

  @Get()
  getPlannedItems(@CurrentUser('userId') userId: string) {
    return this.plannedService.getPlannedItems(userId)
  }

  @Post()
  addPlannedItem(@CurrentUser('userId') userId: string, @Body() body: AddPlannedItemDto) {
    return this.plannedService.addPlannedItem(userId, body)
  }

  @Delete(':id')
  deletePlannedItem(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.plannedService.deletePlannedItem(userId, id)
  }
}
