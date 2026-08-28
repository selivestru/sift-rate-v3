import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'

import { UpsertRankedListDto } from './dto/ranked-list.dto'
import { ReorderRankedItemDto } from './dto/reorder-ranked-item.dto'
import { RankedListService } from './ranked-list.service'
import { CurrentLanguage } from '~/common/decorators/current-language.decorator'
import { CurrentUser } from '~/common/decorators/current-user.decorator'
import { MediaLanguage } from '~/generated/prisma/enums'

@Controller('ranked-list')
export class RankedListController {
  constructor(private readonly rankedListService: RankedListService) {}

  @Get('me')
  getMyLists(@CurrentUser('userId') userId: string, @CurrentLanguage() language: MediaLanguage) {
    return this.rankedListService.getUserRankedLists(userId, language)
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
    @CurrentLanguage() language: MediaLanguage,
  ) {
    return this.rankedListService.addItem(userId, listId, mediaId, language)
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
    @CurrentLanguage() language: MediaLanguage,
  ) {
    return this.rankedListService.reorderItem(userId, listId, itemId, dto, language)
  }
}
