export interface FeedbackResponseDTO {
  id: string;
  apiKey: string;
  projectName: string | null;
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
  apiKeyName: string | null;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
  createdAt: string;
}

export interface ApiKeyResponseDTO {
  id: string;
  apiKey: string;
  name: string | null;
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
