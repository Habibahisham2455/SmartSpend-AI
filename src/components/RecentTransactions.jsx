import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Card from './ui/Card';
import IconBadge from './ui/IconBadge';
import { getCategoryMeta } from '../data/categories';
import { formatCurrency, formatDate } from '../utils/formatters';

// RecentTransactions: transactions = Array
export default function RecentTransactions({ transactions = [] }) {
  const recent = transactions.slice(0, 5);

  return (
    <Card padding="md">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-subtle)]">
        <div>
          <h3 className="text-base font-bold text-[var(--text-main)]">Recent Transactions</h3>
          <p className="text-xs text-slate-400">Latest recorded activity</p>
        </div>
        <Link
          to="/transactions"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#8C52FF] hover:underline"
        >
          <span>View all</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {recent.length === 0 ? (
        <p className="text-xs text-slate-400 py-6 text-center">
          No transactions yet. Click "+ Quick Add" to start.
        </p>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recent.map((tx) => {
            const meta = getCategoryMeta(tx.category);
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <IconBadge
                    icon={meta.icon}
                    color={meta.color}
                    bgColor={meta.bg}
                    size="sm"
                  />
                  <div className="truncate">
                    <p className="text-xs sm:text-sm font-semibold text-[var(--text-main)] truncate">
                      {tx.note || tx.category}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {formatDate(tx.date)} • {tx.category}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs sm:text-sm font-bold shrink-0 ${
                    isIncome ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
