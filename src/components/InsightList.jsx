import { useState } from 'react';
import { Sparkles, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';

// InsightList: insights = [{ id, type, message }]
export default function InsightList({ insights = [] }) {
  const [dismissed, setDismissed] = useState([]);

  const visibleInsights = insights.filter((item) => !dismissed.includes(item.id));

  const typeConfig = {
    info: {
      icon: Info,
      style:
        'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/40 text-blue-900 dark:text-blue-200',
      badge: 'info',
    },
    warning: {
      icon: AlertTriangle,
      style:
        'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200',
      badge: 'warning',
    },
    danger: {
      icon: AlertCircle,
      style:
        'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-200',
      badge: 'danger',
    },
  };

  return (
    <Card padding="md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#8C52FF]/10 text-[#8C52FF] flex items-center justify-center">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-main)]">Smart Tips</h3>
          </div>
        </div>
        <Badge variant="brand" size="sm">
          Rule-based insights
        </Badge>
      </div>

      {/* List */}
      {visibleInsights.length === 0 ? (
        <p className="text-xs text-slate-400 py-3 text-center">
          No active financial alerts or recommendations for this period. Great job!
        </p>
      ) : (
        <div className="space-y-2.5">
          {visibleInsights.map((item) => {
            const config = typeConfig[item.type] || typeConfig.info;
            const Icon = config.icon;

            return (
              <div
                key={item.id}
                className={`flex items-start justify-between gap-3 p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${config.style}`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <Icon className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="leading-snug">{item.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDismissed((prev) => [...prev, item.id])}
                  aria-label="Dismiss tip"
                  className="p-1 rounded-md opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 shrink-0 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
