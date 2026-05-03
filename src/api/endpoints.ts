import axiosInstance from './axiosInstance';
import type {
  FeedbackResponseDTO,
  BugResponseDTO,
  ApiKeyResponseDTO,
  FeedbackStatsDTO,
  Page,
} from '../types';

export async function login(username: string, password: string) {
  const res = await axiosInstance.post<{ token: string; role: string }>('/auth/login', {
    username,
    password,
  });
  return res.data;
}

export async function fetchApiKeys() {
  const res = await axiosInstance.get<ApiKeyResponseDTO[]>('/api/api-keys');
  return res.data;
}

export async function fetchFeedback(params: {
  apiKey?: string;
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
}) {
  const res = await axiosInstance.get<Page<FeedbackResponseDTO>>('/api/feedback', { params });
  return res.data;
}

export async function fetchFeedbackById(id: string) {
  const res = await axiosInstance.get<FeedbackResponseDTO>(`/api/feedback/${id}`);
  return res.data;
}

export async function updateFeedbackStatus(id: string, status: string) {
  const res = await axiosInstance.put<FeedbackResponseDTO>(`/api/feedback/${id}/status`, {
    status,
  });
  return res.data;
}

export async function fetchFeedbackStats(apiKey?: string) {
  const res = await axiosInstance.get<FeedbackStatsDTO>('/api/feedback/stats', {
    params: { apiKey },
  });
  return res.data;
}

export async function fetchBugs(params: { apiKey?: string; status?: string }) {
  const res = await axiosInstance.get<BugResponseDTO[]>('/api/bugs', { params });
  return res.data;
}

export async function fetchBugById(id: string) {
  const res = await axiosInstance.get<BugResponseDTO>(`/api/bugs/${id}`);
  return res.data;
}

export async function updateBugStatus(id: string, status: string) {
  const res = await axiosInstance.put<BugResponseDTO>(`/api/bugs/${id}/status`, { status });
  return res.data;
}
