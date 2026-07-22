import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'

import { UpsertRankedListDto } from './dto/ranked-list.dto'
import { ReorderRankedItemDto } from './dto/reorder-ranked-item.dto'
import { RankedListService } from './ranked-list.service'
import { CurrentUser } from '~/common/decorators/current-user.decorator'

@Controller('ranked-list')
export class RankedListController {
  constructor(private readonly rankedListService: RankedListService) {}

  @Get('me')
  getMyLists(@CurrentUser('userId') userId: string) {
    return this.rankedListService.getUserRankedLists(userId)
  }

  @Post()
  createList(@CurrentUser('userId') userId: string, @Body() dto: UpsertRankedListDto) {
    return this.rankedListService.createList(userId, dto)
  }

  @Put(':id')
  updateList(
    @CurrentUser('userId') userId: string,
    @Param('id') listId: string,
    @Body() dto: UpsertRankedListDto,
  ) {
    return this.rankedListService.updateList(userId, listId, dto)
  }

  @Delete(':id')
  deleteList(@CurrentUser('userId') userId: string, @Param('id') listId: string) {
    return this.rankedListService.deleteList(userId, listId)
  }

  @Post(':id/:mediaId')
  addItem(
    @CurrentUser('userId') userId: string,
    @Param('id') listId: string,
    @Param('mediaId') mediaId: string,
  ) {
    return this.rankedListService.addItem(userId, listId, mediaId)
  }

  @Delete(':id/:itemId')
  deleteItem(
    @CurrentUser('userId') userId: string,
    @Param('id') listId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.rankedListService.deleteItem(userId, listId, itemId)
  }

  @Put(':id/:itemId')
  reorderItem(
    @CurrentUser('userId') userId: string,
    @Param('id') listId: string,
    @Param('itemId') itemId: string,
    @Body() dto: ReorderRankedItemDto,
  ) {
    return this.rankedListService.reorderItem(userId, listId, itemId, dto)
  }
}
