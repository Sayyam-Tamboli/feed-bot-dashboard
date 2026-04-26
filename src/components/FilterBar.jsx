export default function FilterBar({ filters, onChange }) {
  return (
    <div className="filter-bar">
      <label>
        Type
        <select
          value={filters.type}
          onChange={e => onChange({ ...filters, type: e.target.value })}
        >
          <option value="">All</option>
          <option value="bug">Bug</option>
          <option value="feedback">Feedback</option>
        </select>
      </label>
      <label>
        Status
        <select
          value={filters.status}
          onChange={e => onChange({ ...filters, status: e.target.value })}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
        </select>
      </label>
    </div>
  )
}
