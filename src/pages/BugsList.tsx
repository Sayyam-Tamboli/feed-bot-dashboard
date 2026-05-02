import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useApiKey } from '../context/ApiKeyContext';
import { fetchBugs } from '../api/endpoints';
import { SeverityBadge } from '../components/ui/Badge';
import { TableSkeleton } from '../components/ui/Skeleton';
import ApiKeySelector from '../components/shared/ApiKeySelector';

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

export default function BugsList() {
  const navigate = useNavigate();
  const { selectedKey } = useApiKey();

  const { data: bugs = [], isLoading } = useQuery({
    queryKey: ['bugs', selectedKey],
    queryFn: () => fetchBugs({ apiKey: selectedKey || undefined }),
    enabled: !!selectedKey,
  });

  return (
    <div className="space-y-5 max-w-7xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Bugs</h1>
        <p className="text-sm text-gray-500 mt-0.5">{bugs.length} items</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ApiKeySelector />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">API Key</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5}>
                    <TableSkeleton rows={8} cols={5} />
                  </td>
                </tr>
              ) : bugs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400 text-sm">
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
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {bug.id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{bug.apiKeyName}</td>
                    <td className="px-4 py-3 text-gray-700 max-w-sm">
                      {truncate(bug.description, 80)}
                    </td>
                    <td className="px-4 py-3">
                      <SeverityBadge severity={bug.severity} />
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {formatDistanceToNow(parseISO(bug.createdAt), { addSuffix: true })}
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
