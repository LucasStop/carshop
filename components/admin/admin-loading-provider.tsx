'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AdminLoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadingMessage: string;
  setLoadingMessage: (message: string) => void;
}

const AdminLoadingContext = createContext<AdminLoadingContextType | undefined>(
  undefined
);

export function useAdminLoading() {
  const context = useContext(AdminLoadingContext);
  if (!context) {
    throw new Error('useAdminLoading must be used within AdminLoadingProvider');
  }
  return context;
}

interface AdminLoadingProviderProps {
  children: ReactNode;
}

export function AdminLoadingProvider({ children }: AdminLoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Carregando...');

  return (
    <AdminLoadingContext.Provider
      value={{
        isLoading,
        setIsLoading,
        loadingMessage,
        setLoadingMessage,
      }}
    >
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
              <span className="text-sm font-medium">{loadingMessage}</span>
            </div>
          </div>
        </div>
      )}
    </AdminLoadingContext.Provider>
  );
}
