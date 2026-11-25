import { Wallet, Trash2 } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { formatCurrency, formatDate } from '../utils/formatters';

const catMap = Object.fromEntries(CATEGORIES.map((c) => [c.label, c]));

export default function TransactionList({ transactions, onDelete }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl p-8 text-center text-slate-500 text-sm">
        No transactions yet. Add your first one above.
      </div>
    );
  }

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
      <div className="max-h-[480px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {sorted.map((tx) => {
          const cat = catMap[tx.category] ?? { icon: Wallet, label: tx.category, color: '#64748B', bg: '#F1F5F9' };
          const Icon = cat.icon || Wallet;
          const isIncome = tx.type === 'income';
          return (
            <div
              key={tx.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
            >
              {/* Date */}
              <span className="text-slate-400 text-xs w-24 shrink-0 font-medium">
                {formatDate(tx.date)}
              </span>

              {/* Category */}
              <span className="text-sm shrink-0 w-40 flex items-center gap-2 text-[var(--text-main)] font-semibold">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: cat.bg }}
                >
                  <Icon className="w-4 h-4" style={{ color: cat.color }} aria-hidden="true" />
                </div>
                <span className="truncate">{cat.label}</span>
              </span>

              {/* Note */}
              <span className="text-slate-500 text-xs flex-1 truncate">
                {tx.note || '—'}
              </span>

              {/* Amount */}
              <span
                className={`text-sm font-bold w-28 text-right shrink-0 ${
                  isIncome ? 'text-emerald-500' : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
              </span>

              {/* Delete */}
              <button
                type="button"
                onClick={() => onDelete(tx.id)}
                className="ml-2 p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition shrink-0 cursor-pointer"
                aria-label="Delete transaction"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
