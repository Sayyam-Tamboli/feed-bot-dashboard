import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { fetchFeedbackById, updateFeedbackStatus } from '../api/endpoints';
import { StatusBadge, TypeBadge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <div className="text-sm text-gray-800">{children}</div>
    </div>
  );
}

export default function FeedbackDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: item, isLoading, error } = useQuery({
    queryKey: ['feedback', id],
    queryFn: () => fetchFeedbackById(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (status: string) => updateFeedbackStatus(id!, status),
    onSuccess: (updated) => {
      queryClient.setQueryData(['feedback', id], updated);
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      toast.success('Status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-4">
        <Skeleton className="h-5 w-24" />
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-3xl">
        <Link to="/feedback" className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline mb-4">
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          Failed to load feedback
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-5">
      <Link
        to="/feedback"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
      >
        <ArrowLeft size={16} /> Back to Feedback
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Feedback Detail</h1>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{item.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <TypeBadge type={item.type} />
            <StatusBadge status={item.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="API Key">{item.apiKeyName}</Field>
          <Field label="Created At">
            {format(parseISO(item.createdAt), 'PPpp')}
          </Field>
          {item.pageUrl && (
            <Field label="Page URL">
              <a
                href={item.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline break-all"
              >
                {item.pageUrl}
                <ExternalLink size={12} className="shrink-0" />
              </a>
            </Field>
          )}
          {item.browser && <Field label="Browser">{item.browser}</Field>}
          {item.userAgent && (
            <Field label="User Agent">
              <span className="text-xs break-all text-gray-600">{item.userAgent}</span>
            </Field>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Message</p>
          <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
            {item.message}
          </div>
        </div>

        {item.screenshotUrl && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Screenshot</p>
            <img
              src={item.screenshotUrl}
              alt="Screenshot"
              className="max-w-md w-full rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition"
              onClick={() => setModalOpen(true)}
            />
          </div>
        )}

        <div className="border-t border-gray-100 pt-5 flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Update status:</label>
          <select
            value={item.status}
            onChange={(e) => mutation.mutate(e.target.value)}
            disabled={mutation.isPending}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="PENDING">Pending</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {modalOpen && item.screenshotUrl && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <img
            src={item.screenshotUrl}
            alt="Screenshot full"
            className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
