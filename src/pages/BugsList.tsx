import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { fetchBugs, updateBugStatus } from '../api/endpoints';
import { SeverityBadge, StatusBadge } from '../components/ui/Badge';
import { TableSkeleton } from '../components/ui/Skeleton';
import ApiKeySelector from '../components/shared/ApiKeySelector';
import type { BugResponseDTO } from '../types';

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

export default function BugsList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const apiKey = searchParams.get('apiKey') ?? '';
  const filterStatus = searchParams.get('status') ?? '';

  const queryKey = ['bugs', apiKey, filterStatus] as const;

  function setFilter(key: string, value: string) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true }
    );
  }

  const { data: bugs = [], isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      fetchBugs({
        apiKey: apiKey || undefined,
        status: filterStatus || undefined,
      }),
    enabled: !!apiKey,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateBugStatus(id, status),
    onMutate: async ({ id, status: newStatus }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<BugResponseDTO[]>(queryKey);
      queryClient.setQueryData<BugResponseDTO[]>(queryKey, (old) => {
        if (!old) return old;
        return old.map((bug) =>
          bug.id === id
            ? { ...bug, status: newStatus as BugResponseDTO['status'] }
            : bug
        );
      });
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
      toast.error('Failed to update status');
    },
    onSuccess: () => toast.success('Status updated'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['bugs'] }),
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Bugs</h1>
        {!isLoading && (
          <p className="text-sm text-gray-500 mt-0.5">
            {bugs.length} item{bugs.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <ApiKeySelector />

        <select
          value={filterStatus}
          onChange={(e) => setFilter('status', e.target.value)}
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
                {['ID', 'Project', 'Description', 'Severity', 'Status', 'Created', 'Actions'].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={7}>
                    <TableSkeleton rows={8} cols={7} />
                  </td>
                </tr>
              ) : bugs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No bugs found
                  </td>
                </tr>
              ) : (
                bugs.map((bug) => (
                  <tr
                    key={bug.id}
                    onClick={() => navigate(`/bugs/${bug.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">
                      {bug.id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {bug.apiKeyName ?? 'Unnamed Project'}
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-sm">
                      {truncate(bug.description, 80)}
                    </td>
                    <td className="px-4 py-3">
                      <SeverityBadge severity={bug.severity} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={bug.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {formatDistanceToNow(parseISO(bug.createdAt), { addSuffix: true })}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={bug.status}
                        onChange={(e) =>
                          updateMutation.mutate({ id: bug.id, status: e.target.value })
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
      </div>
    </div>
  );
}
