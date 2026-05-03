import { createContext, useContext, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchApiKeys } from '../api/endpoints';
import type { ApiKeyResponseDTO } from '../types';

interface ApiKeyContextType {
  apiKeys: ApiKeyResponseDTO[];
  isLoading: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | null>(null);

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const { data: apiKeys = [], isLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: fetchApiKeys,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <ApiKeyContext.Provider value={{ apiKeys, isLoading }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const ctx = useContext(ApiKeyContext);
  if (!ctx) throw new Error('useApiKey must be used within ApiKeyProvider');
  return ctx;
}
