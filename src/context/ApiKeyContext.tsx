import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchApiKeys } from '../api/endpoints';
import type { ApiKeyResponseDTO } from '../types';

interface ApiKeyContextType {
  apiKeys: ApiKeyResponseDTO[];
  selectedKey: string;
  setSelectedKey: (key: string) => void;
  isLoading: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | null>(null);

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [selectedKey, setSelectedKey] = useState('');

  const { data: apiKeys = [], isLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: fetchApiKeys,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (apiKeys.length > 0 && !selectedKey) {
      setSelectedKey(apiKeys[0].apiKey);
    }
  }, [apiKeys, selectedKey]);

  return (
    <ApiKeyContext.Provider value={{ apiKeys, selectedKey, setSelectedKey, isLoading }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const ctx = useContext(ApiKeyContext);
  if (!ctx) throw new Error('useApiKey must be used within ApiKeyProvider');
  return ctx;
}
