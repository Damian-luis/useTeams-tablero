
import { Board, Column, MoveCardDto } from '@/types/board';
import { api } from '@/utils/axios';

export const boardApi = {
  getColumns: async (): Promise<Column[]> => {
    const response = await api.get('/board/columns');
    return response.data;
  },

  updateColumnEnabled: async (columnId: string, enabled: boolean): Promise<Board> => {
    const response = await api.put(`/board/columns/${columnId}/enabled`, { enabled });
    return response.data;
  },

  moveCard: async (moveCardDto: MoveCardDto): Promise<Board> => {
    const response = await api.post('/board/move-card', moveCardDto);
    return response.data;
  },
}; 