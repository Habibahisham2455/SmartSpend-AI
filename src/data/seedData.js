export const SEED_TRANSACTIONS = [
  // Income
  { id: 'seed-1',  type: 'income',  amount: 2800,  category: 'Other',           note: 'Monthly salary',          date: '2026-11-01' },
  { id: 'seed-2',  type: 'income',  amount: 450,   category: 'Other',           note: 'Freelance web project',   date: '2026-11-10' },

  // November 2026 expenses
  { id: 'seed-3',  type: 'expense', amount: 850,   category: 'Housing',         note: 'Rent',                    date: '2026-11-01' },
  { id: 'seed-4',  type: 'expense', amount: 72.50, category: 'Food & Dining',   note: 'Weekly grocery run',      date: '2026-11-03' },
  { id: 'seed-5',  type: 'expense', amount: 4.80,  category: 'Coffee & Drinks', note: 'Morning latte',           date: '2026-11-04' },
  { id: 'seed-6',  type: 'expense', amount: 38.00, category: 'Transport',       note: 'Monthly bus pass',        date: '2026-11-05' },
  { id: 'seed-7',  type: 'expense', amount: 14.99, category: 'Entertainment',   note: 'Netflix subscription',    date: '2026-11-06' },
  { id: 'seed-8',  type: 'expense', amount: 65.00, category: 'Shopping',        note: 'Shoes on sale',           date: '2026-11-08' },
  { id: 'seed-9',  type: 'expense', amount: 9.50,  category: 'Coffee & Drinks', note: 'Brunch drinks',           date: '2026-11-09' },
  { id: 'seed-10', type: 'expense', amount: 55.20, category: 'Food & Dining',   note: 'Dinner with friends',     date: '2026-11-11' },
  { id: 'seed-11', type: 'expense', amount: 29.00, category: 'Healthcare',      note: 'Pharmacy — vitamins',     date: '2026-11-13' },
  { id: 'seed-12', type: 'expense', amount: 12.99, category: 'Entertainment',   note: 'Spotify subscription',    date: '2026-11-14' },
  { id: 'seed-13', type: 'expense', amount: 7.50,  category: 'Coffee & Drinks', note: 'Coffee & cake',           date: '2026-11-15' },
  { id: 'seed-14', type: 'expense', amount: 42.00, category: 'Education',       note: 'Online course subscription', date: '2026-11-16' },
  { id: 'seed-15', type: 'expense', amount: 88.00, category: 'Food & Dining',   note: 'Weekly groceries',        date: '2026-11-17' },

  // October 2026 expenses
  { id: 'seed-16', type: 'expense', amount: 850,   category: 'Housing',         note: 'Rent',                    date: '2026-10-01' },
  { id: 'seed-17', type: 'expense', amount: 95.00, category: 'Food & Dining',   note: 'Groceries',               date: '2026-10-05' },
  { id: 'seed-18', type: 'expense', amount: 220,   category: 'Travel',          note: 'Weekend trip — hotel',    date: '2026-10-14' },
  { id: 'seed-19', type: 'expense', amount: 38.00, category: 'Transport',       note: 'Monthly bus pass',        date: '2026-10-02' },
  { id: 'seed-20', type: 'expense', amount: 49.99, category: 'Shopping',        note: 'Clothing — autumn jacket',date: '2026-10-20' },
];

export const SEED_BUDGETS = {
  'Food & Dining':    400,
  'Transport':         80,
  'Entertainment':     60,
  'Shopping':         150,
  'Housing':          900,
  'Coffee & Drinks':   50,
  'Healthcare':        75,
};

export const SEED_GOALS = [
  {
    id: 'goal-1',
    name: 'Emergency Fund',
    targetAmount: 3000,
    savedAmount: 850,
    createdAt: '2026-09-01',
  },
  {
    id: 'goal-2',
    name: 'Laptop Upgrade',
    targetAmount: 1200,
    savedAmount: 420,
    createdAt: '2026-10-01',
  },
];
