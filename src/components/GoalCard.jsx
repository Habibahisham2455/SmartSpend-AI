import { useState } from 'react';
import { Plus, Trash2, CheckCircle, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { getGoalProgress, getMonthsToGoal, isGoalMet } from '../utils/goals';
import ProgressRing from './ui/ProgressRing';
import Card from './ui/Card';
import Button from './ui/Button';

const DEFAULT_MONTHLY = 200;

// GoalCard: goal = { id, name, targetAmount, savedAmount }, onAdd (function), onDelete (function)
export default function GoalCard({ goal, onAdd, onDelete }) {
  const [adding, setAdding] = useState(false);
  const [funds, setFunds] = useState('');

  const progress = getGoalProgress(goal);
  const met = isGoalMet(goal);
  const months = getMonthsToGoal(goal, DEFAULT_MONTHLY);

  const handleAdd = () => {
    const amount = parseFloat(funds);
    if (!amount || amount <= 0) return;
    onAdd(goal.id, amount);
    setFunds('');
    setAdding(false);
  };

  return (
    <Card padding="md" className="relative overflow-hidden">
      {/* Celebration banner when goal is met */}
      {met && (
        <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
      )}

      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3.5">
          <ProgressRing
            progress={progress}
            size={68}
            strokeWidth={6}
            color={met ? '#10B981' : '#8C52FF'}
          >
            {met ? (
              <CheckCircle className="w-6 h-6 text-emerald-500 animate-bounce" />
            ) : (
              <span className="text-xs font-black text-[var(--text-main)]">
                {progress}%
              </span>
            )}
          </ProgressRing>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[var(--text-main)] text-base tracking-tight">
                {goal.name}
              </h3>
              {met && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  <Sparkles className="w-3 h-3" />
                  Goal Met!
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {met ? (
                'Target achieved! Amazing savings discipline.'
              ) : months === Infinity ? (
                'Set contributions to calculate timeframe'
              ) : (
                `~${months} month${months === 1 ? '' : 's'} left at ${formatCurrency(DEFAULT_MONTHLY)}/mo`
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDelete(goal.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition shrink-0 cursor-pointer"
          aria-label={`Delete ${goal.name} goal`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Target & Saved Info */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs font-medium mb-4">
        <div>
          <span className="text-slate-400 block text-[11px]">Saved so far</span>
          <span className="font-bold text-sm text-[var(--text-main)]">
            {formatCurrency(goal.savedAmount)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-slate-400 block text-[11px]">Target Goal</span>
          <span className="font-bold text-sm text-slate-600 dark:text-slate-300">
            {formatCurrency(goal.targetAmount)}
          </span>
        </div>
      </div>

      {/* Add Funds Action */}
      {adding ? (
        <div className="flex items-center gap-2 pt-1 animate-fadeIn">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              $
            </span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={funds}
              onChange={(e) => setFunds(e.target.value)}
              placeholder="0.00"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              autoFocus
              className="w-full text-xs font-semibold pl-6 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-[var(--surface-card)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[#8C52FF]"
            />
          </div>
          <Button variant="primary" size="sm" onClick={handleAdd}>
            Deposit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setAdding(false);
              setFunds('');
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          icon={Plus}
          onClick={() => setAdding(true)}
          className="w-full justify-center"
        >
          Add Money
        </Button>
      )}
    </Card>
  );
}
