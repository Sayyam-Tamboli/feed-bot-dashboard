import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { fetchBugById } from '../api/endpoints';
import { SeverityBadge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <div className="text-sm text-gray-800">{children}</div>
    </div>
  );
}

export default function BugDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: bug, isLoading, error } = useQuery({
    queryKey: ['bugs', id],
    queryFn: () => fetchBugById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-4">
        <Skeleton className="h-5 w-24" />
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !bug) {
    return (
      <div className="max-w-3xl">
        <Link to="/bugs" className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline mb-4">
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          Failed to load bug
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-5">
      <Link
        to="/bugs"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
      >
        <ArrowLeft size={16} /> Back to Bugs
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Bug Report</h1>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{bug.id}</p>
          </div>
          <SeverityBadge severity={bug.severity} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="API Key">{bug.apiKeyName}</Field>
          <Field label="Severity">{bug.severity}</Field>
          <Field label="Created At">
            {format(parseISO(bug.createdAt), 'PPpp')}
          </Field>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</p>
          <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
            {bug.description}
          </div>
        </div>
      </div>
    </div>
  );
}
