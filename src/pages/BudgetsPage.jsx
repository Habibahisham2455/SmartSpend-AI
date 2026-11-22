import { useState } from 'react';
import { useFinance } from '../hooks/useFinance';
import { getBudgetStatus } from '../utils/budget';
import { CATEGORIES } from '../data/categories';
import BudgetBar from '../components/BudgetBar';

export default function BudgetsPage() {
  const { transactions, budgets, dispatch } = useFinance();
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [error, setError] = useState('');

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const budgetStatus = getBudgetStatus(transactions, budgets, year, month);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!category) { setError('Select a category.'); return; }
    if (!limit || Number(limit) <= 0) { setError('Enter a valid limit.'); return; }
    setError('');
    dispatch({ type: 'ADD_BUDGET', payload: { category, limit: parseFloat(limit) } });
    setCategory('');
    setLimit('');
  };

  const handleDelete = (cat) => {
    dispatch({ type: 'DELETE_BUDGET', payload: cat });
  };

  const usedCategories = Object.keys(budgets);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-white">Budgets</h1>

      {/* Add budget form */}
      <form
        onSubmit={handleAdd}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
      >
        <h2 className="text-lg font-bold text-white">Set Monthly Budget</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setError(''); }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-green-500"
            >
              <option value="">Select category…</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.label}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Monthly Limit ($)</label>
            <input
              type="number"
              min="1"
              step="1"
              value={limit}
              onChange={(e) => { setLimit(e.target.value); setError(''); }}
              placeholder="e.g. 400"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-green-500"
            />
          </div>
        </div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-400 text-black font-bold py-2 px-6 rounded-xl text-sm transition"
        >
          Add Budget
        </button>
      </form>

      {/* Budget bars */}
      {usedCategories.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-sm">
          No budgets set yet. Add one above.
        </div>
      ) : (
        <div className="space-y-3">
          {budgetStatus.map((item) => (
            <div key={item.category} className="relative">
              <BudgetBar {...item} />
              <button
                onClick={() => handleDelete(item.category)}
                className="absolute top-4 right-4 text-slate-600 hover:text-red-400 transition text-xs"
                aria-label={`Delete ${item.category} budget`}
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
