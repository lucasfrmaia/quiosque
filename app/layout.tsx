'use client';

import { FC, useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './_components/Sidebar';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import './globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const LayoutContent: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {isAuthenticated && !isLoginPage && (
        <Sidebar isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)} />
      )}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out p-8 ${isAuthenticated && !isLoginPage ? (isExpanded ? 'ml-64' : 'ml-16') : ''}`}
      >
        {children}
      </main>
    </div>
  );
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <LayoutContent>{children}</LayoutContent>
          </QueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
