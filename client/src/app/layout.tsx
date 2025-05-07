import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { BoardProvider } from '@/context/BoardContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tablero Kanban",
  description: "Tablero Kanban para el manejo de tickets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Toaster position="top-right" />
        <BoardProvider>
          {children}
        </BoardProvider>
      </body>
    </html>
  );
}
