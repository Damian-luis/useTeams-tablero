'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useBoardContext } from '@/context/BoardContext';
import { Column as ColumnType, Card as CardType } from '@/types/board';
import { boardApi } from '@/services/api';
import { Sidebar } from './Sidebar';
import { toast } from 'react-hot-toast';

const Card: React.FC<{ card: CardType; index: number }> = ({ card, index }) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-4 mb-2 rounded-lg shadow-md border border-gray-200"
        >
          <h3 className="text-gray-800 font-semibold mb-2">{card.title}</h3>
          <p className="text-gray-600 text-sm">{card.description}</p>
        </div>
      )}
    </Draggable>
  );
};

const Column: React.FC<{ column: ColumnType; index: number }> = ({ column }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg min-w-[300px] max-w-[300px]">
      <h2 className="text-gray-800 font-bold mb-4">{column.title}</h2>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[200px]"
          >
            {column.cards.map((card, index) => (
              <Card key={card.id} card={card} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export const Board: React.FC = () => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket, board } = useBoardContext();

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const data = await boardApi.getColumns();
        setColumns(data);
      } catch (error) {
        console.error('Error fetching columns:', error);
        toast.error('Error al cargar las columnas');
      } finally {
        setLoading(false);
      }
    };
    fetchColumns();
  }, []);

  useEffect(() => {
    if (board) {
      console.log('[Board] Actualizando columnas desde contexto:', board.columns);
      setColumns(board.columns);
    }
  }, [board]);

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    const sourceColumn = columns.find(
      (col) => col.id === result.source.droppableId
    );
    const destinationColumn = columns.find(
      (col) => col.id === result.destination.droppableId
    );
    if (!sourceColumn || !destinationColumn) return;
    if (socket) {
      console.log('[Socket] Emitting moveCard', {
        cardId: result.draggableId,
        sourceColumnId: result.source.droppableId,
        destinationColumnId: result.destination.droppableId,
        newIndex: result.destination.index,
      });
      socket.emit('moveCard', {
        cardId: result.draggableId,
        sourceColumnId: result.source.droppableId,
        destinationColumnId: result.destination.droppableId,
        newIndex: result.destination.index,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Filter enabled columns
  const enabledColumns = columns.filter(column => column.enabled);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-50 flex flex-col items-center justify-start py-8 ml-16 px-2">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center w-full">Tablero Kanban</h1>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex flex-col sm:flex-row gap-6 overflow-x-auto pb-4 snap-x w-full">
            {enabledColumns.map((column, index) => (
              <div key={column.id} className="snap-start">
                <Column column={column} index={index} />
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}; 