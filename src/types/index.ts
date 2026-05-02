export interface FeedbackResponseDTO {
  id: string;
  apiKey: string;
  apiKeyName: string;
  type: 'BUG' | 'FEEDBACK';
  message: string;
  screenshotUrl: string | null;
  pageUrl: string | null;
  browser: string | null;
  userAgent: string | null;
  createdAt: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
}

export interface BugResponseDTO {
  id: string;
  apiKey: string;
  apiKeyName: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: string;
}

export interface ApiKeyResponseDTO {
  id: string;
  apiKey: string;
  name: string;
  createdAt: string;
}

export interface FeedbackStatsDTO {
  total: number;
  pending: number;
  reviewed: number;
  resolved: number;
  bug: number;
  feedback: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
