import { createContext, useContext, useEffect, useState } from 'react'
import { fetchApiKeys } from '../services/api'

const ApiKeyContext = createContext(null)

export function ApiKeyProvider({ children }) {
  const [apiKeys, setApiKeys] = useState([])
  const [selectedKey, setSelectedKey] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchApiKeys()
      .then(res => {
        const keys = (res.data || []).filter(k => k.active)
        setApiKeys(keys)
        if (keys.length > 0) setSelectedKey(keys[0].apiKey)
      })
      .catch(() => setError('Could not load API keys.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <ApiKeyContext.Provider value={{ apiKeys, selectedKey, setSelectedKey, loading, error }}>
      {children}
    </ApiKeyContext.Provider>
  )
}

export function useApiKey() {
  return useContext(ApiKeyContext)
}
