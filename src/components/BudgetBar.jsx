import { useState } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, Pencil, Check } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import ProgressBar from './ui/ProgressBar';
import Card from './ui/Card';
import IconBadge from './ui/IconBadge';
import { getCategoryMeta } from '../data/categories';

// BudgetBar: category, limit, spent, percent, status, onUpdateLimit (optional)
export default function BudgetBar({
  category,
  limit,
  spent,
  percent,
  status,
  onUpdateLimit,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newLimit, setNewLimit] = useState(limit);
  const meta = getCategoryMeta(category);

  const isDanger = status === 'danger';
  const isWarning = status === 'warning';

  const handleSave = () => {
    const parsed = parseFloat(newLimit);
    if (!isNaN(parsed) && parsed > 0 && onUpdateLimit) {
      onUpdateLimit(category, parsed);
    }
    setIsEditing(false);
  };

  const progressColor = isDanger
    ? 'bg-rose-500'
    : isWarning
    ? 'bg-amber-500'
    : 'bg-emerald-500';

  return (
    <Card padding="md">
      <div className="flex items-center justify-between gap-4 mb-3">
        {/* Category info */}
        <div className="flex items-center gap-3 min-w-0">
          <IconBadge
            icon={meta.icon}
            color={meta.color}
            bgColor={meta.bg}
            size="md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-[var(--text-main)] truncate">
                {category}
              </h4>
              {isDanger && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                  <AlertCircle className="w-3 h-3" />
                  Over limit
                </span>
              )}
              {isWarning && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                  <AlertTriangle className="w-3 h-3" />
                  Nearing limit
                </span>
              )}
              {!isDanger && !isWarning && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  On track
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {Math.round(percent)}% of monthly limit spent
            </p>
          </div>
        </div>

        {/* Amounts and inline edit */}
        <div className="text-right shrink-0">
          <div className="flex items-center justify-end gap-1.5 text-xs font-semibold text-slate-500">
            <span>Spent:</span>
            <span className="text-sm font-bold text-[var(--text-main)]">
              {formatCurrency(spent)}
            </span>
          </div>

          <div className="flex items-center justify-end gap-1 mt-0.5">
            <span className="text-xs text-slate-400">Limit:</span>
            {isEditing ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  autoFocus
                  className="w-20 px-2 py-0.5 text-xs font-bold rounded border border-[#8C52FF] bg-[var(--surface-card)] text-[var(--text-main)]"
                />
                <button
                  type="button"
                  onClick={handleSave}
                  className="p-1 rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                  aria-label="Save limit"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setNewLimit(limit);
                  setIsEditing(true);
                }}
                title="Click to edit limit"
                className="group flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#8C52FF] transition cursor-pointer"
              >
                <span>{formatCurrency(limit)}</span>
                <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        value={percent}
        colorClass={progressColor}
        height="md"
      />
    </Card>
  );
}
