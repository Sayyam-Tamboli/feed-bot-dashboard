import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FeedBot } from '@stl-ai-org/feedbot';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FeedbackList from './pages/FeedbackList';
import FeedbackDetail from './pages/FeedbackDetail';
import BugsList from './pages/BugsList';
import BugDetail from './pages/BugDetail';
import ProtectedRoute from './components/shared/ProtectedRoute';
import PageLayout from './components/layout/PageLayout';
import '@stl-ai-org/feedbot/dist/feedbot.css';

export default function App() {
  return (
    <BrowserRouter>
    <FeedBot 
        apiKey="feed-dashboard-key"
        position="bottom-right"
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<PageLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/feedback" element={<FeedbackList />} />
            <Route path="/feedback/:id" element={<FeedbackDetail />} />
            <Route path="/bugs" element={<BugsList />} />
            <Route path="/bugs/:id" element={<BugDetail />} />
            <Route index path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
