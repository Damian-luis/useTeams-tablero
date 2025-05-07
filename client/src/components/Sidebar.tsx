'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiSettings, FiHome } from 'react-icons/fi';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const isSettings = pathname === '/settings';

  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-[#0052CC] flex flex-col items-center py-4 shadow-lg z-20">
      <Link
        href={isSettings ? '/' : '/settings'}
        className="p-3 hover:bg-[#0747A6] rounded-lg transition-colors duration-200"
        title={isSettings ? 'Volver al Tablero' : 'Ajustes del Tablero'}
      >
        {isSettings ? (
          <FiHome className="w-6 h-6 text-white" />
        ) : (
          <FiSettings className="w-6 h-6 text-white" />
        )}
      </Link>
    </div>
  );
}; 