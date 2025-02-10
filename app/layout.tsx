import type { Metadata } from "next";
import "./globals.css";
import { FC } from 'react';
import Sidebar from './_components/Sidebar';

export const metadata: Metadata = {
  title: "Kiosque - Sistema de Gestão",
  description: "Sistema de gestão para quiosques",
};

interface LayoutProps {
  children: React.ReactNode;
}

const RootLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
