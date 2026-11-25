import { useState } from 'react';
import { CATEGORIES } from '../data/categories';
import { useFinance } from '../hooks/useFinance';
import { useToast } from './ui/Toast';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { formatCurrency } from '../utils/formatters';

// QuickAddModal: isOpen (boolean), onClose (function)
export default function QuickAddModal({ isOpen, onClose }) {
  const { dispatch } = useFinance();
  const { showToast } = useToast();

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].label);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }
    if (!category) {
      setError('Please choose a category.');
      return;
    }

    const newTx = {
      type,
      amount: Math.round(num * 100) / 100,
      category,
      note: note.trim(),
      date,
    };

    dispatch({ type: 'ADD_TRANSACTION', payload: newTx });

    showToast(
      `${type === 'income' ? 'Income' : 'Expense'} recorded: ${formatCurrency(newTx.amount)} (${category})`,
      'success'
    );

    // Reset and close
    setAmount('');
    setNote('');
    setError('');
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick Add Transaction" maxWidth="md">
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-5">
        {/* Type Toggle: Expense vs Income */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`py-2 text-sm font-bold rounded-lg transition-all ${
              type === 'expense'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`py-2 text-sm font-bold rounded-lg transition-all ${
              type === 'income'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Income
          </button>
        </div>

        {/* Large Amount Input */}
        <div>
          <label htmlFor="quick-amount" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Amount
          </label>
          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 focus-within:ring-2 focus-within:ring-[#8C52FF] focus-within:border-transparent transition-all">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">
              $
            </span>
            <input
              id="quick-amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (error) setError('');
              }}
              autoFocus
              className="w-full bg-transparent pl-10 pr-4 py-3.5 text-2xl font-black text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none"
            />
          </div>
          {error && <p className="text-xs text-rose-500 mt-1.5 font-medium">{error}</p>}
        </div>

        {/* Category Selector Grid */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.label;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.label)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                    isSelected
                      ? 'border-[#8C52FF] bg-[#8C52FF]/10 text-[#8C52FF] ring-2 ring-[#8C52FF]/30'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: cat.bg }}
                  >
                    <Icon className="w-4 h-4" style={{ color: cat.color }} />
                  </div>
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Note and Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="quick-note" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Note (Optional)
            </label>
            <input
              id="quick-note"
              type="text"
              placeholder="e.g. Lunch with team"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8C52FF]"
            />
          </div>
          <div>
            <label htmlFor="quick-date" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Date
            </label>
            <input
              id="quick-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8C52FF]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit">
            Save Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
}
