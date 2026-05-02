import { useApiKey } from '../../context/ApiKeyContext';

export default function ApiKeySelector() {
  const { apiKeys, selectedKey, setSelectedKey, isLoading } = useApiKey();

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
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Project</label>
      <select
        value={selectedKey}
        onChange={(e) => setSelectedKey(e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition max-w-[200px]"
      >
        {apiKeys.map((k) => (
          <option key={k.id} value={k.apiKey}>
            {k.name}
          </option>
        ))}
      </select>
    </div>
  );
}
