import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApiKey } from '../context/ApiKeyContext';
import { fetchFeedback, updateFeedbackStatus } from '../api/endpoints';
import { StatusBadge, TypeBadge } from '../components/ui/Badge';
import { TableSkeleton } from '../components/ui/Skeleton';
import ApiKeySelector from '../components/shared/ApiKeySelector';
import type { FeedbackResponseDTO, Page } from '../types';

const PAGE_SIZE = 20;

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

export default function FeedbackList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { selectedKey } = useApiKey();

  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(0);

  const queryKey = ['feedback', selectedKey, filterType, filterStatus, page] as const;

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      fetchFeedback({
        apiKey: selectedKey || undefined,
        type: filterType || undefined,
        status: filterStatus || undefined,
        page,
        size: PAGE_SIZE,
        sort: 'createdAt,desc',
      }),
    enabled: !!selectedKey,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateFeedbackStatus(id, status),
    onMutate: async ({ id, status: newStatus }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Page<FeedbackResponseDTO>>(queryKey);
      queryClient.setQueryData<Page<FeedbackResponseDTO>>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          content: old.content.map((item) =>
            item.id === id
              ? { ...item, status: newStatus as FeedbackResponseDTO['status'] }
              : item
          ),
        };
      });
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
      toast.error('Failed to update status');
    },
    onSuccess: () => {
      toast.success('Status updated');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });

  const items = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  function handleFilterChange() {
    setPage(0);
  }

  return (
    <div className="space-y-5 max-w-7xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Feedback</h1>
        <p className="text-sm text-gray-500 mt-0.5">{totalElements} items</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <ApiKeySelector />

        <select
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); handleFilterChange(); }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All types</option>
          <option value="BUG">Bug</option>
          <option value="FEEDBACK">Feedback</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); handleFilterChange(); }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">API Key</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={7}>
                    <TableSkeleton rows={8} cols={7} />
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No feedback found
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/feedback/${item.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {item.id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{item.apiKeyName}</td>
                    <td className="px-4 py-3">
                      <TypeBadge type={item.type} />
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-xs">
                      {truncate(item.message, 60)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {formatDistanceToNow(parseISO(item.createdAt), { addSuffix: true })}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={item.status}
                        onChange={(e) =>
                          updateMutation.mutate({ id: item.id, status: e.target.value })
                        }
                        disabled={updateMutation.isPending}
                        className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="REVIEWED">Reviewed</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              Page {page + 1} of {totalPages} · {totalElements} total
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages - 1}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
