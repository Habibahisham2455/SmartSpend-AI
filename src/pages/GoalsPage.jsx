import { useState } from 'react';
import { Plus, Target, Sparkles } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { useToast } from '../components/ui/Toast';
import PageHeader from '../components/layout/PageHeader';
import GoalCard from '../components/GoalCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatCurrency } from '../utils/formatters';

let nextGoalId = Date.now();

export default function GoalsPage() {
  const { goals, dispatch } = useFinance();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [error, setError] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a goal name.');
      return;
    }
    const val = parseFloat(target);
    if (!target || isNaN(val) || val <= 0) {
      setError('Please enter a valid target amount.');
      return;
    }
    setError('');

    const newGoal = {
      id: `goal-${++nextGoalId}`,
      name: name.trim(),
      targetAmount: val,
      savedAmount: 0,
      createdAt: new Date().toISOString(),
    };

    dispatch({
      type: 'ADD_GOAL',
      payload: newGoal,
    });

    showToast(`Savings goal created: ${newGoal.name} (${formatCurrency(val)})`, 'success');
    setName('');
    setTarget('');
  };

  const handleAddFunds = (id, amount) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;
    const newSaved = goal.savedAmount + amount;
    dispatch({
      type: 'UPDATE_GOAL',
      payload: { ...goal, savedAmount: newSaved },
    });

    if (newSaved >= goal.targetAmount) {
      showToast(`🎉 Congratulations! You reached your goal for "${goal.name}"!`, 'success');
    } else {
      showToast(`Added ${formatCurrency(amount)} to "${goal.name}"`, 'success');
    }
  };

  const handleDelete = (id) => {
    const goal = goals.find((g) => g.id === id);
    dispatch({ type: 'DELETE_GOAL', payload: id });
    showToast(`Removed goal: "${goal?.name || 'Goal'}"`, 'info');
  };

  const totalSaved = goals.reduce((acc, g) => acc + (g.savedAmount || 0), 0);
  const totalTarget = goals.reduce((acc, g) => acc + (g.targetAmount || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Savings Goals"
        subtitle="Set clear financial targets and visualize your progress with automatic contribution pace"
      />

      {/* Overview Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="sm" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8C52FF]/10 text-[#8C52FF] flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Active Goals</span>
            <span className="text-lg font-black text-[var(--text-main)]">{goals.length}</span>
          </div>
        </Card>

        <Card padding="sm" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Total Saved</span>
            <span className="text-lg font-black text-emerald-600">
              {formatCurrency(totalSaved)}
            </span>
          </div>
        </Card>

        <Card padding="sm" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Total Target</span>
            <span className="text-lg font-black text-[var(--text-main)]">
              {formatCurrency(totalTarget)}
            </span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Create Goal Form */}
        <div className="lg:col-span-1">
          <Card padding="md">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[var(--border-subtle)]">
              <div className="w-8 h-8 rounded-lg bg-brand-gradient text-white flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[var(--text-main)]">
                Create New Goal
              </h3>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Goal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. New Laptop, Emergency Fund"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[#8C52FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Target Amount ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="e.g. 1500"
                    value={target}
                    onChange={(e) => {
                      setTarget(e.target.value);
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
                Create Goal
              </Button>
            </form>
          </Card>
        </div>

        {/* Right 2 Columns: Goal Cards Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[var(--text-main)]">
              Your Goals ({goals.length})
            </h3>
          </div>

          {goals.length === 0 ? (
            <Card padding="lg" className="text-center text-slate-400 text-sm">
              <p>No savings goals set yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                Define your first savings objective using the form on the left.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onAdd={handleAddFunds}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
