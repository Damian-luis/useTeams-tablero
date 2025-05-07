import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardController } from '../controllers/board.controller';
import { BoardService } from '../services/board.service';
import { Board, BoardSchema } from '../schemas/board.schema';
import { BoardGateway } from '../gateways/board.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]),
  ],
  controllers: [BoardController],
  providers: [BoardService, BoardGateway],
})
export class BoardModule {} 