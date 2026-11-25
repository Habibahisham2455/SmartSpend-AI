import { useState } from 'react';
import { AlertTriangle, AlertCircle, X } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

// AlertBanner: alerts = [{ category, status, spent, limit }]
export default function AlertBanner({ alerts = [] }) {
  const [dismissed, setDismissed] = useState([]);

  if (!alerts || alerts.length === 0) return null;

  const visible = alerts.filter((a) => !dismissed.includes(a.category));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {visible.map((alert) => {
        const isDanger = alert.status === 'danger';
        const Icon = isDanger ? AlertCircle : AlertTriangle;

        return (
          <div
            key={alert.category}
            role="alert"
            className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border text-xs sm:text-sm shadow-sm transition-all ${
              isDanger
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isDanger
                    ? 'bg-rose-500 text-white'
                    : 'bg-amber-500 text-white'
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
              </div>
              <p className="truncate">
                <span className="font-bold">{alert.category}: </span>
                {isDanger
                  ? `Over budget! Spent ${formatCurrency(alert.spent)} of ${formatCurrency(alert.limit)} limit.`
                  : `Nearing 80% limit (${formatCurrency(alert.spent)} of ${formatCurrency(alert.limit)}).`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setDismissed((d) => [...d, alert.category])}
              className="p-1 rounded-lg opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 shrink-0 transition-opacity"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
