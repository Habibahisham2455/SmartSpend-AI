import { useState } from 'react';
import { useFinance } from '../hooks/useFinance';
import GoalCard from '../components/GoalCard';

let nextGoalId = Date.now();

export default function GoalsPage() {
  const { goals, dispatch } = useFinance();
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [error, setError] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Enter a goal name.'); return; }
    if (!target || Number(target) <= 0) { setError('Enter a valid target amount.'); return; }
    setError('');
    dispatch({
      type: 'ADD_GOAL',
      payload: {
        id: `goal-${++nextGoalId}`,
        name: name.trim(),
        targetAmount: parseFloat(target),
        savedAmount: 0,
        createdAt: new Date().toISOString(),
      },
    });
    setName('');
    setTarget('');
  };

  const handleAddFunds = (id, amount) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;
    dispatch({
      type: 'UPDATE_GOAL',
      payload: { ...goal, savedAmount: goal.savedAmount + amount },
    });
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_GOAL', payload: id });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-white">Savings Goals</h1>

      {/* Add goal form */}
      <form
        onSubmit={handleAdd}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
      >
        <h2 className="text-lg font-bold text-white">New Goal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Goal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="e.g. Emergency Fund"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Target Amount ($)</label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={target}
              onChange={(e) => { setTarget(e.target.value); setError(''); }}
              placeholder="e.g. 5000"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-green-500"
            />
          </div>
        </div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-400 text-black font-bold py-2 px-6 rounded-xl text-sm transition"
        >
          Add Goal
        </button>
      </form>

      {/* Goal cards */}
      {goals.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-sm">
          No goals yet. Create your first one above.
        </div>
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
  );
}
