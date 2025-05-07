import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Board extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({
    type: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        enabled: { type: Boolean, required: true, default: true },
        cards: [
          {
            id: { type: String, required: true },
            title: { type: String, required: true },
            description: { type: String, required: true },
            order: { type: Number, required: true },
          },
        ],
      },
    ],
    required: true,
    default: [],
  })
  columns: Array<{
    id: string;
    title: string;
    enabled: boolean;
    cards: Array<{
      id: string;
      title: string;
      description: string;
      order: number;
    }>;
  }>;
}

export const BoardSchema = SchemaFactory.createForClass(Board); 