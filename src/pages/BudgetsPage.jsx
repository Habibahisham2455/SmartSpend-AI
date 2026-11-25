import { useState } from 'react';
import { Plus, PiggyBank } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { useToast } from '../components/ui/Toast';
import { getBudgetStatus, getCategoryAlerts } from '../utils/budget';
import { CATEGORIES } from '../data/categories';
import PageHeader from '../components/layout/PageHeader';
import BudgetBar from '../components/BudgetBar';
import AlertBanner from '../components/AlertBanner';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function BudgetsPage() {
  const { transactions, budgets, dispatch } = useFinance();
  const { showToast } = useToast();

  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [error, setError] = useState('');

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const budgetStatus = getBudgetStatus(transactions, budgets, year, month);
  const alerts = getCategoryAlerts(transactions, budgets, year, month);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!category) {
      setError('Please select a category.');
      return;
    }
    const val = parseFloat(limit);
    if (!limit || isNaN(val) || val <= 0) {
      setError('Please enter a valid monthly limit greater than $0.');
      return;
    }
    setError('');

    dispatch({
      type: 'ADD_BUDGET',
      payload: { category, limit: val },
    });

    showToast(`Budget set for ${category}: $${val.toFixed(2)}/month`, 'success');
    setCategory('');
    setLimit('');
  };

  const handleUpdateLimit = (cat, newLimit) => {
    dispatch({
      type: 'ADD_BUDGET',
      payload: { category: cat, limit: newLimit },
    });
    showToast(`Updated ${cat} budget limit to $${newLimit.toFixed(2)}`, 'success');
  };

  const handleDelete = (cat) => {
    dispatch({ type: 'DELETE_BUDGET', payload: cat });
    showToast(`Removed budget for ${cat}`, 'info');
  };

  const usedCategories = Object.keys(budgets);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Budgets & Limits"
        subtitle="Set spending guardrails by category with automatic 80% warning and 100% danger alerts"
      />

      {/* Active Alerts */}
      {alerts.length > 0 && <AlertBanner alerts={alerts} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Set Budget Form */}
        <div className="lg:col-span-1">
          <Card padding="md">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[var(--border-subtle)]">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <PiggyBank className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-main)]">
                  Add / Update Budget
                </h3>
              </div>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[#8C52FF]"
                >
                  <option value="">Select category…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.label}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Monthly Limit ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="e.g. 400"
                    value={limit}
                    onChange={(e) => {
                      setLimit(e.target.value);
                      if (error) setError('');
                    }}
                    className="w-full text-xs sm:text-sm pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[#8C52FF]"
                  />
                </div>
                {error && <p className="text-xs text-rose-500 mt-1.5 font-medium">{error}</p>}
              </div>

              <Button
                variant="primary"
                size="md"
                type="submit"
                icon={Plus}
                className="w-full justify-center"
              >
                Set Budget
              </Button>
            </form>
          </Card>
        </div>

        {/* Right 2 Columns: Budget Status Bars */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[var(--text-main)]">
              Active Category Budgets ({usedCategories.length})
            </h3>
            <span className="text-xs text-slate-400">
              Click limit to edit directly
            </span>
          </div>

          {usedCategories.length === 0 ? (
            <Card padding="lg" className="text-center text-slate-400 text-sm">
              <p>No budgets configured yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                Select a category on the left to set your first spending limit.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {budgetStatus.map((item) => (
                <div key={item.category} className="relative group">
                  <BudgetBar
                    {...item}
                    onUpdateLimit={handleUpdateLimit}
                  />
                  <button
                    type="button"
                    onClick={() => handleDelete(item.category)}
                    className="absolute top-4 right-4 text-xs font-semibold text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                    aria-label={`Delete ${item.category} budget`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
