'use client';

import React, { useEffect, useState } from 'react';
import { useBoardContext } from '@/context/BoardContext';
import { Column } from '@/types/board';
import { Sidebar } from '@/components/Sidebar';
import { toast } from 'react-hot-toast';
import { boardApi } from '@/services/api';

export default function SettingsPage() {
  const { board, socket } = useBoardContext();
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const data = await boardApi.getColumns();
        setColumns(data);
      } catch (error) {
        console.error('Error al cargar las columnas:', error);
        toast.error('Error al cargar las columnas');
      } finally {
        setLoading(false);
      }
    };

    fetchColumns();
  }, []);

  useEffect(() => {
    if (board?.columns) {
      setColumns(board.columns);
      setLoading(false);
    }
  }, [board]);

  useEffect(() => {
    if (!socket) return;
    const handleBoardUpdated = (updatedBoard: any) => {
      console.log('boardUpdated recibido:', updatedBoard);
      setColumns(updatedBoard.columns);
    };
    socket.on('boardUpdated', handleBoardUpdated);
    return () => {
      socket.off('boardUpdated', handleBoardUpdated);
    };
  }, [socket]);

  const handleToggleColumn = async (columnId: string, enabled: boolean) => {

    // try {
    //   const updatedBoard = await boardApi.updateColumnEnabled(columnId, enabled);
    //   setColumns(updatedBoard.columns);
    //   toast.success('Columna actualizada correctamente');
    // } catch (error) {
    //   console.error('Error al actualizar la columna:', error);
    //   toast.error('Error al actualizar la columna');
    // }


    if (socket) {
      console.log('Emite updateColumnEnabled', { columnId, enabled });
      socket.emit('updateColumnEnabled', { columnId, enabled });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-50 flex flex-col items-center justify-start py-8 ml-16 px-2">
        <div className="w-full max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Configuración del Tablero</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Visibilidad de Columnas</h2>
            <div className="space-y-4">
              {columns?.map((column) => (
                <div key={column.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-800 font-medium">{column.title}</span>
                  <label className="relative inline-flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={column.enabled}
                      disabled={column.title === 'Historias'}
                      onChange={(e) => handleToggleColumn(column.id, e.target.checked)}
                    />
                    <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${column.title === 'Historias' ? 'opacity-60 cursor-not-allowed' : ''}`}></div>
                    {column.title === 'Historias' && (
                      <span className="absolute left-14 text-xs text-gray-500 hidden group-hover:block bg-white px-2 py-1 rounded shadow">Esta columna no puede deshabilitarse</span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 