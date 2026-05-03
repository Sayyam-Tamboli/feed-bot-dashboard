import { cn } from '../../lib/utils';

export function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    REVIEWED: 'bg-blue-100 text-blue-800',
    RESOLVED: 'bg-green-100 text-green-800',
  };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', variants[status] ?? 'bg-gray-100 text-gray-700')}>
      {status}
    </span>
  );
}

export function TypeBadge({ type }: { type: string }) {
  const variants: Record<string, string> = {
    BUG: 'bg-red-100 text-red-700',
    FEEDBACK: 'bg-sky-100 text-sky-700',
  };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', variants[type] ?? 'bg-gray-100 text-gray-700')}>
      {type}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: string }) {
  const variants: Record<string, string> = {
    LOW: 'bg-green-100 text-green-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    HIGH: 'bg-orange-100 text-orange-700',
    CRITICAL: 'bg-red-100 text-red-700',
  };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', variants[severity] ?? 'bg-gray-100 text-gray-700')}>
      {severity}
    </span>
  );
}
