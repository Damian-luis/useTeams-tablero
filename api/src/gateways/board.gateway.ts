import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BoardService } from '../services/board.service';
import { MoveCardDto } from '../types/board.types';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class BoardGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly boardService: BoardService) {}

  @SubscribeMessage('joinBoard')
  handleJoinBoard(@ConnectedSocket() client: Socket) {
    console.log('cliente:', client.id);
    client.join('main-board');
    return { event: 'joinedBoard' };
  }

  @SubscribeMessage('leaveBoard')
  handleLeaveBoard(@ConnectedSocket() client: Socket) {
    console.log('cliente saliendo:', client.id);
    client.leave('main-board');
    return { event: 'leftBoard' };
  }

  @SubscribeMessage('moveCard')
  async handleMoveCard(@MessageBody() moveCardDto: MoveCardDto, @ConnectedSocket() client: Socket) {

    const updatedBoard = await this.boardService.moveCard(moveCardDto);

    const movedCard = updatedBoard.columns
      .find(col => col.id === moveCardDto.destinationColumnId)?.cards
      .find(card => card.id === moveCardDto.cardId);
    const destinationColumn = updatedBoard.columns.find(col => col.id === moveCardDto.destinationColumnId);

    this.server.to('main-board').emit('boardUpdated', {
      board: updatedBoard,
      movement: movedCard && destinationColumn ? {
        cardTitle: movedCard.title,
        columnTitle: destinationColumn.title,
        by: client.id,
      } : null,
    });
    return updatedBoard;
  }

  @SubscribeMessage('updateColumnEnabled')
  async handleUpdateColumnEnabled(@MessageBody() data: { columnId: string; enabled: boolean }) {

    const updatedBoard = await this.boardService.updateColumnEnabled(data.columnId, data.enabled);

    this.server.to('main-board').emit('boardUpdated', { board: updatedBoard });
    return updatedBoard;
  }
}