import axios from 'axios'

const client = axios.create({ baseURL: 'http://localhost:8080/api' })

export function fetchApiKeys() {
  return client.get('/api-keys')
}

export function fetchFeedback(apiKey, params = {}) {
  return client.get('/feedback', { params: { apiKey, ...params } })
}

export function fetchFeedbackById(id, apiKey) {
  return client.get(`/feedback/${id}`, { params: { apiKey } })
}

export function updateStatus(id, status) {
  return client.put(`/feedback/${id}/status`, { status })
}
