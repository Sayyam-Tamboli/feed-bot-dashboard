import { useApiKey } from '../context/ApiKeyContext'

export default function ApiKeySelector() {
  const { apiKeys, selectedKey, setSelectedKey, loading, error } = useApiKey()

  if (loading) return <span className="apikey-status">Loading keys…</span>
  if (error) return <span className="apikey-status apikey-error">{error}</span>
  if (apiKeys.length === 0) return <span className="apikey-status">No active API keys</span>

  return (
    <div className="apikey-selector">
      <label htmlFor="apikey-select">Project</label>
      <select
        id="apikey-select"
        value={selectedKey}
        onChange={e => setSelectedKey(e.target.value)}
      >
        {apiKeys.map(k => (
          <option key={k.id} value={k.apiKey}>
            {k.projectName}
          </option>
        ))}
      </select>
    </div>
  )
}
