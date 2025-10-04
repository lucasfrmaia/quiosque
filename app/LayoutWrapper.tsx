'use client';

import { FC } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './_components/Sidebar';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutContent: FC<LayoutWrapperProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <div className="flex min-h-screen bg-gray-50">
      {isAuthenticated && !isLoginPage && <Sidebar />}
      <main className={`flex-1 ${isAuthenticated && !isLoginPage ? 'ml-64' : ''} p-8`}>
        {children}
      </main>
    </div>
  );
};

export const LayoutWrapper: FC<LayoutWrapperProps> = ({ children }) => {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
};
