import { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import { getGoalProgress, getMonthsToGoal, isGoalMet } from '../utils/goals';

const DEFAULT_MONTHLY = 200;

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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-white text-base">{goal.name}</h3>
          {met ? (
            <span className="text-xs text-green-400 font-semibold">🎉 Goal met!</span>
          ) : (
            <span className="text-xs text-slate-500">
              {months === Infinity ? '∞' : months} month{months === 1 ? '' : 's'} at{' '}
              {formatCurrency(DEFAULT_MONTHLY)}/mo
            </span>
          )}
        </div>
        <button
          onClick={() => onDelete(goal.id)}
          className="text-slate-600 hover:text-red-400 transition text-xs"
          aria-label="Delete goal"
        >
          🗑
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-slate-800 rounded-full">
        <div
          className="h-3 rounded-full bg-green-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Amounts */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">
          {formatCurrency(goal.savedAmount)} saved
        </span>
        <span className="text-slate-500">
          of {formatCurrency(goal.targetAmount)} ({progress}%)
        </span>
      </div>

      {/* Add funds */}
      {!met && (
        adding ? (
          <div className="flex gap-2">
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={funds}
              onChange={(e) => setFunds(e.target.value)}
              placeholder="Amount"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-sm focus:outline-none focus:border-green-500"
              autoFocus
            />
            <button
              onClick={handleAdd}
              className="bg-green-500 hover:bg-green-400 text-black font-bold px-3 rounded-xl text-sm transition"
            >
              Save
            </button>
            <button
              onClick={() => { setAdding(false); setFunds(''); }}
              className="text-slate-500 hover:text-white text-sm transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="text-sm text-green-400 hover:text-green-300 font-semibold transition"
          >
            + Add funds
          </button>
        )
      )}
    </div>
  );
}
