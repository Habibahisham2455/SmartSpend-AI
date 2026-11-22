import { formatCurrency } from '../utils/formatters';

const STATUS_COLORS = {
  ok: 'bg-green-500',
  warning: 'bg-yellow-400',
  danger: 'bg-red-500',
};

const STATUS_TRACK = {
  ok: 'bg-green-500/20',
  warning: 'bg-yellow-400/20',
  danger: 'bg-red-500/20',
};

export default function BudgetBar({ category, limit, spent, percent, status }) {
  const barColor = STATUS_COLORS[status] ?? STATUS_COLORS.ok;
  const trackColor = STATUS_TRACK[status] ?? STATUS_TRACK.ok;
  const cappedPercent = Math.min(percent, 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-white">{category}</span>
        <span className="text-slate-400">
          {formatCurrency(spent)}{' '}
          <span className="text-slate-600">/</span>{' '}
          {formatCurrency(limit)}
        </span>
      </div>

      <div className={`w-full h-3 rounded-full ${trackColor}`}>
        <div
          className={`h-3 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${cappedPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{Math.round(percent)}% used</span>
        {status === 'danger' && (
          <span className="text-red-400 font-semibold">Over budget!</span>
        )}
        {status === 'warning' && (
          <span className="text-yellow-400 font-semibold">Near limit</span>
        )}
      </div>
    </div>
  );
}
