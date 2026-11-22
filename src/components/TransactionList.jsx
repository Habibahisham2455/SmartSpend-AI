import { CATEGORIES } from '../data/categories';
import { formatCurrency, formatDate } from '../utils/formatters';

const catMap = Object.fromEntries(CATEGORIES.map((c) => [c.label, c]));

export default function TransactionList({ transactions, onDelete }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-sm">
        No transactions yet. Add your first one above.
      </div>
    );
  }

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="max-h-[480px] overflow-y-auto divide-y divide-slate-800">
        {sorted.map((tx) => {
          const cat = catMap[tx.category] ?? { icon: '📦', label: tx.category };
          const isIncome = tx.type === 'income';
          return (
            <div
              key={tx.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 transition"
            >
              {/* Date */}
              <span className="text-slate-500 text-xs w-24 shrink-0">
                {formatDate(tx.date)}
              </span>

              {/* Category */}
              <span className="text-sm shrink-0 w-36 flex items-center gap-1 text-slate-300">
                <span>{cat.icon}</span>
                <span className="truncate">{cat.label}</span>
              </span>

              {/* Note */}
              <span className="text-slate-400 text-xs flex-1 truncate">
                {tx.note || '—'}
              </span>

              {/* Amount */}
              <span
                className={`text-sm font-semibold w-24 text-right shrink-0 ${
                  isIncome ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
              </span>

              {/* Delete */}
              <button
                onClick={() => onDelete(tx.id)}
                className="ml-2 text-slate-600 hover:text-red-400 transition shrink-0"
                aria-label="Delete transaction"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
