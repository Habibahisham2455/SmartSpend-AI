import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Plus, Filter, ArrowUpDown } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { useToast } from '../components/ui/Toast';
import { CATEGORIES } from '../data/categories';
import PageHeader from '../components/layout/PageHeader';
import TransactionList from '../components/TransactionList';
import QuickAddModal from '../components/QuickAddModal';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { formatCurrency } from '../utils/formatters';

export default function TransactionsPage() {
  const { transactions, dispatch } = useFinance();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters from query or state
  const initialCategory = searchParams.get('category') || 'ALL';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedType, setSelectedType] = useState('ALL'); // 'ALL' | 'expense' | 'income'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc'|'date-asc'|'amount-desc'|'amount-asc'
  const [selectedMonth, setSelectedMonth] = useState('ALL'); // 'ALL' | 'YYYY-MM'

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Available months from transactions
  const availableMonths = useMemo(() => {
    const set = new Set();
    transactions.forEach((tx) => {
      if (tx.date) {
        set.add(tx.date.slice(0, 7));
      }
    });
    return Array.from(set).sort().reverse();
  }, [transactions]);

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Search term
        if (searchTerm) {
          const lower = searchTerm.toLowerCase();
          const matchNote = tx.note?.toLowerCase().includes(lower);
          const matchCat = tx.category?.toLowerCase().includes(lower);
          const matchAmount = tx.amount?.toString().includes(lower);
          if (!matchNote && !matchCat && !matchAmount) return false;
        }

        // Type filter
        if (selectedType !== 'ALL' && tx.type !== selectedType) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'ALL' && tx.category !== selectedCategory) {
          return false;
        }

        // Month filter
        if (selectedMonth !== 'ALL' && !tx.date?.startsWith(selectedMonth)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        return 0;
      });
  }, [transactions, searchTerm, selectedType, selectedCategory, selectedMonth, sortBy]);

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const removedTx = deleteTarget;
    dispatch({ type: 'DELETE_TRANSACTION', payload: removedTx.id });
    setDeleteTarget(null);

    // Show undo toast
    showToast(
      `Deleted ${formatCurrency(removedTx.amount)} (${removedTx.category})`,
      'info',
      {
        label: 'Undo',
        onUndo: () => {
          dispatch({ type: 'ADD_TRANSACTION', payload: removedTx });
        },
      }
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Transactions"
        subtitle={`Viewing ${filteredTransactions.length} of ${transactions.length} total entries`}
        actions={
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setIsQuickAddOpen(true)}
          >
            Add Transaction
          </Button>
        }
      />

      {/* Filter & Search Bar Card */}
      <Card padding="md" className="space-y-4">
        {/* Top row: Search input + Month Select + Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search box */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes, category, amount…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[var(--text-main)] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8C52FF]"
            />
          </div>

          {/* Month selector */}
          <div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[#8C52FF]"
            >
              <option value="ALL">All Months</option>
              {availableMonths.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[#8C52FF]"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Type Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            Type:
          </span>
          {['ALL', 'expense', 'income'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                selectedType === t
                  ? 'bg-[#8C52FF] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t === 'ALL' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1) + 's'}
            </button>
          ))}
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Category:
          </span>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchParams({});
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setSelectedCategory(c.label);
                setSearchParams({ category: c.label });
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === c.label
                  ? 'bg-brand-gradient text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Transaction List */}
      <TransactionList
        transactions={filteredTransactions}
        onDelete={(id) => {
          const tx = transactions.find((t) => t.id === id);
          setDeleteTarget(tx);
        }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Delete"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to delete this transaction for{' '}
            <span className="font-bold text-[var(--text-main)]">
              {deleteTarget && formatCurrency(deleteTarget.amount)}
            </span>{' '}
            ({deleteTarget?.category})?
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </div>
  );
}
