import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApiKey } from '../../context/ApiKeyContext';

const STORAGE_KEY = 'feedbot_selected_api_key';

export default function ApiKeySelector() {
  const { apiKeys, isLoading } = useApiKey();
  const [searchParams, setSearchParams] = useSearchParams();

  const selected = searchParams.get('apiKey') ?? '';

  // When no apiKey param is in the URL, init from localStorage or first key
  useEffect(() => {
    if (selected || isLoading || apiKeys.length === 0) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    const valid = saved && apiKeys.some((k) => k.apiKey === saved);
    const key = valid ? saved! : apiKeys[0].apiKey;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('apiKey', key);
        return next;
      },
      { replace: true }
    );
  }, [apiKeys, isLoading, selected, setSearchParams]);

  function handleChange(key: string) {
    localStorage.setItem(STORAGE_KEY, key);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('apiKey', key);
        return next;
      },
      { replace: true }
    );
  }

  if (isLoading) {
    return (
      <select disabled className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 text-gray-400">
        <option>Loading…</option>
      </select>
    );
  }

  if (apiKeys.length === 0) {
    return <span className="text-sm text-gray-400">No API keys</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Project
      </label>
      <select
        value={selected}
        onChange={(e) => handleChange(e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition max-w-[220px]"
      >
        {apiKeys.map((k) => (
          <option key={k.id} value={k.apiKey}>
            {k.name ?? 'Unnamed Project'}
          </option>
        ))}
      </select>
    </div>
  );
}
