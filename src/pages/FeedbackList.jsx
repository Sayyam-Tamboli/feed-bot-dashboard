import { useState, useEffect } from 'react'
import FeedbackCard from '../components/FeedbackCard'
import FilterBar from '../components/FilterBar'
import Pagination from '../components/Pagination'
import { useApiKey } from '../context/ApiKeyContext'
import { fetchFeedback } from '../services/api'

const PAGE_SIZE = 10

export default function FeedbackList() {
  const { selectedKey, loading: keyLoading } = useApiKey()

  const [items, setItems] = useState([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [filters, setFilters] = useState({ type: '', status: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setPage(0)
  }, [filters, selectedKey])

  useEffect(() => {
    if (keyLoading || !selectedKey) return

    let cancelled = false
    setLoading(true)
    setError(null)

    const params = { page, size: PAGE_SIZE }
    if (filters.type) params.type = filters.type
    if (filters.status) params.status = filters.status

    fetchFeedback(selectedKey, params)
      .then(res => {
        if (cancelled) return
        setItems(res.data.content ?? [])
        setTotalElements(res.data.totalElements ?? 0)
        setTotalPages(res.data.totalPages ?? 0)
      })
      .catch(err => {
        if (cancelled) return
        setError(err.message || 'Failed to load feedback.')
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [page, filters, selectedKey, keyLoading])

  if (keyLoading) {
    return <div className="page-container"><div className="state-container">Loading…</div></div>
  }

  return (
    <div className="page-container">
      <h2 className="page-title">Feedback</h2>
      <FilterBar filters={filters} onChange={setFilters} />

      {error && <div className="error-message">{error}</div>}

      {!error && (
        <p className="total-count">
          {loading ? 'Loading…' : `${totalElements} item${totalElements !== 1 ? 's' : ''}`}
        </p>
      )}

      {loading ? (
        <div className="state-container">Loading feedback…</div>
      ) : !error && items.length === 0 ? (
        <div className="state-container">No feedback found.</div>
      ) : (
        <div className="feedback-list">
          {items.map(item => (
            <FeedbackCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
