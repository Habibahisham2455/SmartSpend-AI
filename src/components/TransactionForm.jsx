import { useState } from 'react';
import { CATEGORIES } from '../data/categories';

const today = () => new Date().toISOString().split('T')[0];

const INITIAL = {
  type: 'expense',
  amount: '',
  category: '',
  note: '',
  date: today(),
};

export default function TransactionForm({ onSubmit }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.amount || Number(form.amount) <= 0) {
      errs.amount = 'Amount must be greater than 0.';
    }
    if (!form.category) {
      errs.category = 'Please select a category.';
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({
      type: form.type,
      amount: parseFloat(form.amount),
      category: form.category,
      note: form.note.trim(),
      date: form.date,
    });
    setForm({ ...INITIAL, date: today() });
    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
    >
      <h2 className="text-lg font-bold text-white">Add Transaction</h2>

      {/* Type toggle */}
      <div className="flex gap-2">
        {['expense', 'income'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => set('type', t)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${
              form.type === t
                ? t === 'income'
                  ? 'bg-green-500 text-black'
                  : 'bg-red-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm text-slate-400 mb-1">Amount ($)</label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={form.amount}
          onChange={(e) => set('amount', e.target.value)}
          placeholder="0.00"
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-green-500"
        />
        {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm text-slate-400 mb-1">Category</label>
        <select
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-green-500"
        >
          <option value="">Select category…</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.label}>
              {c.icon} {c.label}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm text-slate-400 mb-1">Note (optional)</label>
        <input
          type="text"
          value={form.note}
          onChange={(e) => set('note', e.target.value)}
          placeholder="e.g. Lunch with colleagues"
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-green-500"
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm text-slate-400 mb-1">Date</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => set('date', e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-green-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-2 rounded-xl transition text-sm"
      >
        Add Transaction
      </button>
    </form>
  );
}
