import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'

function truncate(str, max) {
  if (!str) return ''
  return str.length > max ? str.slice(0, max) + '…' : str
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function FeedbackCard({ item }) {
  const navigate = useNavigate()

  return (
    <div className="feedback-card" onClick={() => navigate(`/feedback/${item.id}`)}>
      <div className="feedback-card-body">
        <div className="feedback-card-top">
          <span className="feedback-type">{item.type}</span>
          <StatusBadge status={item.status} />
        </div>
        <p className="feedback-card-message">{truncate(item.message, 80)}</p>
        <span className="feedback-card-meta">{formatDate(item.createdAt)}</span>
      </div>
    </div>
  )
}
