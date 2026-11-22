import { useState } from 'react';
import { formatCurrency } from '../utils/formatters';

export default function AlertBanner({ alerts }) {
  const [dismissed, setDismissed] = useState([]);

  if (!alerts || alerts.length === 0) return null;

  const visible = alerts.filter((a) => !dismissed.includes(a.category));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-2">
      {visible.map((alert) => {
        const isDanger = alert.status === 'danger';
        return (
          <div
            key={alert.category}
            className={`flex items-start justify-between gap-3 px-4 py-3 rounded-xl border text-sm ${
              isDanger
                ? 'bg-red-500/10 border-red-500/30 text-red-300'
                : 'bg-yellow-400/10 border-yellow-400/30 text-yellow-300'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="mt-0.5">{isDanger ? '🔴' : '⚠️'}</span>
              <p>
                <strong>{alert.category}</strong>:{' '}
                {isDanger
                  ? `Over budget! Spent ${formatCurrency(alert.spent)} of ${formatCurrency(alert.limit)}.`
                  : `Nearing limit — ${formatCurrency(alert.spent)} of ${formatCurrency(alert.limit)} used.`}
              </p>
            </div>
            <button
              onClick={() => setDismissed((d) => [...d, alert.category])}
              className="shrink-0 opacity-60 hover:opacity-100 transition"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
