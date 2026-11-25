import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Plus, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

function useCountUp(target, duration = 800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const startVal = 0;
    const endVal = Number(target) || 0;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(startVal + (endVal - startVal) * ease);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [target, duration]);

  return count;
}

// DashboardHero: income (number), expenses (number), balance (number), onQuickAdd (function)
export default function DashboardHero({
  income = 0,
  expenses = 0,
  balance = 0,
  onQuickAdd,
}) {
  const animatedBalance = useCountUp(balance);
  const animatedIncome = useCountUp(income);
  const animatedExpenses = useCountUp(expenses);

  const savingsRate = income > 0 ? Math.max(0, Math.round(((income - expenses) / income) * 100)) : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-brand-gradient text-white p-6 sm:p-8 shadow-xl shadow-[#8C52FF]/20">
      {/* Decorative ambient background blur */}
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute right-32 -bottom-20 w-52 h-52 rounded-full bg-[#3D00B5]/40 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Total Balance & Label */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
            <span>TOTAL BALANCE</span>
          </div>

          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
              {formatCurrency(animatedBalance)}
            </h2>
            <span className="text-sm font-semibold opacity-80">USD</span>
          </div>

          <p className="text-xs sm:text-sm text-white/80 font-medium">
            Savings rate:{' '}
            <span className="font-bold text-emerald-300">{savingsRate}%</span> of
            monthly income preserved
          </p>
        </div>

        {/* Right: Quick Add Button */}
        {onQuickAdd && (
          <div className="flex items-center">
            <button
              type="button"
              onClick={onQuickAdd}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#3533CD] font-bold text-sm shadow-lg shadow-black/10 hover:bg-white/95 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
              <span>Quick Add</span>
            </button>
          </div>
        )}
      </div>

      {/* Chips: Monthly Income & Expense stats */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/15">
        {/* Income Card */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
            </div>
            <div>
              <span className="block text-xs font-semibold text-white/70">
                Monthly Income
              </span>
              <span className="text-xl font-bold tracking-tight text-white">
                {formatCurrency(animatedIncome)}
              </span>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-1 rounded-md bg-emerald-400/20 text-emerald-200">
            Incoming
          </span>
        </div>

        {/* Expense Card */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0">
              <TrendingDown className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
            </div>
            <div>
              <span className="block text-xs font-semibold text-white/70">
                Monthly Expenses
              </span>
              <span className="text-xl font-bold tracking-tight text-white">
                {formatCurrency(animatedExpenses)}
              </span>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-1 rounded-md bg-rose-400/20 text-rose-200">
            Outgoing
          </span>
        </div>
      </div>
    </div>
  );
}
