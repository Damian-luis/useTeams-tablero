'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Board } from '@/types/board';
import toast from 'react-hot-toast';

interface BoardContextType {
  board: Board | null;
  setBoard: (board: Board) => void;
  socket: Socket | null;
  loading: boolean;
  error: string | null;
  lastMovement: { cardTitle: string; columnTitle: string; by: string } | null;
}

const BoardContext = createContext<BoardContextType>({
  board: null,
  setBoard: () => {},
  socket: null,
  loading: false,
  error: null,
  lastMovement: null,
});

export const useBoardContext = () => useContext(BoardContext);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMovement, setLastMovement] = useState<{ cardTitle: string; columnTitle: string; by: string } | null>(null);
  const [mySocketId, setMySocketId] = useState<string | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const newSocket = io(url);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setMySocketId(newSocket.id??null);
      newSocket.emit('joinBoard');
    });

    newSocket.on('boardUpdated', (payload: any) => {
      const { board: updatedBoard, movement } = payload;
      console.log('boardUpdated recibido en contexto:', updatedBoard, movement);
      setBoard(updatedBoard);
      if (movement && movement.by !== newSocket.id) {
        setLastMovement(movement);
        toast.custom(() => (
          <div className="flex items-center gap-2 bg-blue-50 text-blue-900 px-4 py-2 rounded shadow">
            <span className="font-semibold">{movement.cardTitle}</span>
            <span>→</span>
            <span>pasó a</span>
            <span className="font-semibold">{movement.columnTitle}</span>
          </div>
        ));
        // Sonido
        const audio = new Audio('/notificacion.mp3');
        audio.play();
      }
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const value = {
    board,
    setBoard,
    socket,
    loading,
    error,
    lastMovement,
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}; 