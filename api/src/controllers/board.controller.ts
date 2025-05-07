import { Controller, Get, Put, Post, Body, Param } from '@nestjs/common';
import { Board } from '../schemas/board.schema';
import { MoveCardDto, UpdateColumnEnabledDto } from '../types/board.types';
import { BoardService } from '../services/board.service';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('columns')
  async getColumns(): Promise<Board['columns']> {
    return this.boardService.getColumns();
  }

  @Put('columns/:columnId/enabled')
  async updateColumnEnabled(
    @Param('columnId') columnId: string,
    @Body() updateColumnEnabledDto: UpdateColumnEnabledDto,
  ): Promise<Board> {
    return this.boardService.updateColumnEnabled(columnId, updateColumnEnabledDto.enabled);
  }

  @Post('move-card')
  async moveCard(@Body() moveCardDto: MoveCardDto): Promise<Board> {
    return this.boardService.moveCard(moveCardDto);
  }
} 