import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useApiKey } from '../context/ApiKeyContext';
import { fetchFeedbackStats } from '../api/endpoints';
import { StatCardSkeleton } from '../components/ui/Skeleton';
import ApiKeySelector from '../components/shared/ApiKeySelector';

const STATUS_COLORS = {
  Pending: '#eab308',
  Reviewed: '#3b82f6',
  Resolved: '#22c55e',
};

interface StatCardProps {
  label: string;
  value: number;
  color: string;
}

function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { selectedKey } = useApiKey();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['feedback-stats', selectedKey],
    queryFn: () => fetchFeedbackStats(selectedKey),
    enabled: !!selectedKey,
  });

  const typeChartData = [
    { name: 'Bug', count: stats?.bug ?? 0, fill: '#ef4444' },
    { name: 'Feedback', count: stats?.feedback ?? 0, fill: '#0ea5e9' },
  ];

  const statusChartData = [
    { name: 'Pending', value: stats?.pending ?? 0 },
    { name: 'Reviewed', value: stats?.reviewed ?? 0 },
    { name: 'Resolved', value: stats?.resolved ?? 0 },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Overview of feedback and bug activity</p>
        </div>
        <ApiKeySelector />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : stats ? (
          <>
            <StatCard label="Total" value={stats.total} color="text-gray-900" />
            <StatCard label="Pending" value={stats.pending} color="text-yellow-600" />
            <StatCard label="Reviewed" value={stats.reviewed} color="text-blue-600" />
            <StatCard label="Resolved" value={stats.resolved} color="text-green-600" />
            <StatCard label="Bugs" value={stats.bug} color="text-red-600" />
            <StatCard label="Feedback" value={stats.feedback} color="text-sky-600" />
          </>
        ) : (
          <p className="col-span-6 text-sm text-gray-500 py-8 text-center">
            Select an API key to view stats
          </p>
        )}
      </div>

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Type Distribution</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={typeChartData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {typeChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Status Breakdown</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  dataKey="value"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {statusChartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
