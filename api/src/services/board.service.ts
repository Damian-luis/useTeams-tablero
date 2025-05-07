import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board } from '../schemas/board.schema';
import { Column, MoveCardDto } from '../types/board.types';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<Board>,
  ) {

  }

  async getColumns(): Promise<Column[]> {
    const board = await this.boardModel.find();

    if (!board) {
      throw new NotFoundException('No board found');
    }
    return board[0].columns;
  }

  
  async updateColumnEnabled(columnId: string, enabled: boolean): Promise<Board> {

    const board = await this.boardModel.findOne();
    if (!board) {
      throw new NotFoundException('No board found');
    }

    const column = board.columns.find(col => col.id === columnId);
    if (!column) {
      throw new NotFoundException(`Column with ID ${columnId} not found`);
    }

    // en el caso de que se deshabilite una columna con tarjetas, se mueven a la columna "Historias"
    if (!enabled && column.cards.length > 0) {
      const historiasColumn = board.columns.find(col => col.title === 'Historias');
      if (historiasColumn) {
        historiasColumn.cards = [...historiasColumn.cards, ...column.cards];
        column.cards = [];
      }
    }

    column.enabled = enabled;
    const saved = await board.save();
    return saved;
  }

  async moveCard(moveCardDto: MoveCardDto): Promise<Board> {
    const board = await this.boardModel.findOne();
    if (!board) {

      throw new NotFoundException('No board found');
    }

    const sourceColumn = board.columns.find(
      col => col.id === moveCardDto.sourceColumnId,
    );
    const destinationColumn = board.columns.find(
      col => col.id === moveCardDto.destinationColumnId,
    );

    if (!sourceColumn || !destinationColumn) {

      throw new NotFoundException('Source or destination column not found');
    }

    const cardIndex = sourceColumn.cards.findIndex(
      card => card.id === moveCardDto.cardId,
    );
    //verifica si la tarjeta existe en la columna de origen
    if (cardIndex === -1) {

      throw new NotFoundException('Card not found in source column');
    }

    // Extrae la tarjeta de la columna de origen
    const [movedCard] = sourceColumn.cards.splice(cardIndex, 1);
    
    // Agrega la tarjeta a la columna de destino en el índice especificado
    destinationColumn.cards.splice(moveCardDto.newIndex, 0, movedCard);

    // Actualiza el orden para todas las tarjetas en las columnas afectadas
    sourceColumn.cards.forEach((card, index) => {
      card.order = index;
    });
    destinationColumn.cards.forEach((card, index) => {
      card.order = index;
    });

    const saved = await board.save();
    return saved;
  }
} 