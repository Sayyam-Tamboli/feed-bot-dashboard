import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { useApiKey } from '../context/ApiKeyContext'
import { fetchFeedbackById, updateStatus } from '../services/api'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function FeedbackDetail() {
  const { id } = useParams()
  const { selectedKey } = useApiKey()

  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const load = useCallback(() => {
    if (!selectedKey) return
    setLoading(true)
    setError(null)
    fetchFeedbackById(id, selectedKey)
      .then(res => setItem(res.data))
      .catch(err => setError(err.message || 'Failed to load feedback.'))
      .finally(() => setLoading(false))
  }, [id, selectedKey])

  useEffect(() => { load() }, [load])

  async function handleStatusUpdate(status) {
    setUpdating(true)
    try {
      await updateStatus(id, status)
      await load()
    } catch (err) {
      setError(err.message || 'Failed to update status.')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="state-container">Loading…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <Link to="/" className="back-link">← Back</Link>
        <div className="error-message">{error}</div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <Link to="/" className="back-link">← Back to Feedback</Link>

      <div className="detail-card">
        <h2>Feedback Detail</h2>

        <div className="detail-grid">
          <div className="detail-field">
            <label>Type</label>
            <p>{item.type}</p>
          </div>
          <div className="detail-field">
            <label>Status</label>
            <StatusBadge status={item.status} />
          </div>
          <div className="detail-field">
            <label>Created At</label>
            <p>{formatDate(item.createdAt)}</p>
          </div>
          {item.pageUrl && (
            <div className="detail-field">
              <label>Page URL</label>
              <p style={{ wordBreak: 'break-all' }}>{item.pageUrl}</p>
            </div>
          )}
          {item.browser && (
            <div className="detail-field">
              <label>Browser</label>
              <p>{item.browser}</p>
            </div>
          )}
        </div>

        <div className="detail-message">
          <label>Message</label>
          <p>{item.message}</p>
        </div>

        {item.screenshotUrl && (
          <div className="screenshot-section">
            <label>Screenshot</label>
            <img
              src={item.screenshotUrl}
              alt="Screenshot"
              className="screenshot-thumb"
              onClick={() => setModalOpen(true)}
            />
          </div>
        )}

        <div className="detail-actions">
          <button
            className="btn btn-reviewed"
            onClick={() => handleStatusUpdate('reviewed')}
            disabled={updating || item.status === 'reviewed'}
          >
            Mark Reviewed
          </button>
          <button
            className="btn btn-resolved"
            onClick={() => handleStatusUpdate('resolved')}
            disabled={updating || item.status === 'resolved'}
          >
            Mark Resolved
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <img src={item.screenshotUrl} alt="Screenshot full" />
        </div>
      )}
    </div>
  )
}
