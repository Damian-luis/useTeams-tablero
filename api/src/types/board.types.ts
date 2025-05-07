export interface Card {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
  enabled: boolean;
}

export interface Board {
  _id: string;
  title: string;
  columns: Column[];
}

export interface MoveCardDto {
  cardId: string;
  sourceColumnId: string;
  destinationColumnId: string;
  newIndex: number;
}

export interface UpdateColumnEnabledDto {
  enabled: boolean;
} 