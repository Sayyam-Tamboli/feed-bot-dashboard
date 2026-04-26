import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ApiKeyProvider } from './context/ApiKeyContext'
import ApiKeySelector from './components/ApiKeySelector'
import FeedbackList from './pages/FeedbackList'
import FeedbackDetail from './pages/FeedbackDetail'
import './styles/dashboard.css'

export default function App() {
  return (
    <BrowserRouter>
      <ApiKeyProvider>
        <header className="app-header">
          <h1>FeedBot Dashboard</h1>
          <ApiKeySelector />
        </header>
        <Routes>
          <Route path="/" element={<FeedbackList />} />
          <Route path="/feedback/:id" element={<FeedbackDetail />} />
        </Routes>
      </ApiKeyProvider>
    </BrowserRouter>
  )
}
