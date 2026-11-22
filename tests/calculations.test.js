import { describe, it, expect } from 'vitest';
import {
  getTotalIncome,
  getTotalExpenses,
  getBalance,
  getByCategory,
  getMonthlyTotals,
  getTopCategory,
} from '../src/utils/calculations.js';

const TX = [
  { id: '1', type: 'income',  amount: 2000, category: 'Salary',          note: 'Paycheck',  date: '2026-11-01' },
  { id: '2', type: 'income',  amount:  500, category: 'Freelance',        note: 'Side gig',  date: '2026-11-05' },
  { id: '3', type: 'expense', amount:  300, category: 'Food & Dining',    note: 'Groceries', date: '2026-11-10' },
  { id: '4', type: 'expense', amount:  150, category: 'Transport',        note: 'Uber',      date: '2026-11-12' },
  { id: '5', type: 'expense', amount:  400, category: 'Food & Dining',    note: 'Dining',    date: '2026-11-20' },
  { id: '6', type: 'expense', amount:   80, category: 'Entertainment',    note: 'Movies',    date: '2026-10-15' }, // Oct
];

describe('getTotalIncome', () => {
  it('sums all income transactions', () => {
    expect(getTotalIncome(TX)).toBe(2500);
  });

  it('returns 0 for empty array', () => {
    expect(getTotalIncome([])).toBe(0);
  });

  it('returns 0 when no income transactions', () => {
    const expensesOnly = TX.filter((t) => t.type === 'expense');
    expect(getTotalIncome(expensesOnly)).toBe(0);
  });
});

describe('getTotalExpenses', () => {
  it('sums all expense transactions', () => {
    expect(getTotalExpenses(TX)).toBe(930);
  });

  it('returns 0 for empty array', () => {
    expect(getTotalExpenses([])).toBe(0);
  });

  it('returns 0 when no expense transactions', () => {
    const incomeOnly = TX.filter((t) => t.type === 'income');
    expect(getTotalExpenses(incomeOnly)).toBe(0);
  });
});

describe('getBalance', () => {
  it('returns income minus expenses', () => {
    expect(getBalance(TX)).toBe(2500 - 930);
  });

  it('returns 0 for empty array', () => {
    expect(getBalance([])).toBe(0);
  });

  it('returns negative when expenses exceed income', () => {
    const overspent = [
      { id: 'a', type: 'income',  amount: 100, category: 'X', note: '', date: '2026-11-01' },
      { id: 'b', type: 'expense', amount: 200, category: 'Y', note: '', date: '2026-11-02' },
    ];
    expect(getBalance(overspent)).toBe(-100);
  });
});

describe('getByCategory', () => {
  it('groups expenses by category sorted descending', () => {
    const result = getByCategory(TX);
    expect(result[0].category).toBe('Food & Dining');
    expect(result[0].total).toBe(700);
    expect(result[1].category).toBe('Transport');
    expect(result[1].total).toBe(150);
    expect(result[2].category).toBe('Entertainment');
    expect(result[2].total).toBe(80);
  });

  it('excludes income transactions', () => {
    const result = getByCategory(TX);
    const categories = result.map((r) => r.category);
    expect(categories).not.toContain('Salary');
    expect(categories).not.toContain('Freelance');
  });

  it('returns empty array for empty input', () => {
    expect(getByCategory([])).toEqual([]);
  });

  it('returns empty array when only income exists', () => {
    const incomeOnly = TX.filter((t) => t.type === 'income');
    expect(getByCategory(incomeOnly)).toEqual([]);
  });
});

describe('getMonthlyTotals', () => {
  it('filters to the correct month', () => {
    const result = getMonthlyTotals(TX, 2026, 11);
    expect(result.income).toBe(2500);
    // Nov expenses only: 300 + 150 + 400 = 850 (Oct's 80 excluded)
    expect(result.expenses).toBe(850);
    expect(result.balance).toBe(1650);
  });

  it('returns zeros for a month with no transactions', () => {
    const result = getMonthlyTotals(TX, 2025, 1);
    expect(result).toEqual({ income: 0, expenses: 0, balance: 0 });
  });

  it('handles October data correctly', () => {
    const result = getMonthlyTotals(TX, 2026, 10);
    expect(result.income).toBe(0);
    expect(result.expenses).toBe(80);
    expect(result.balance).toBe(-80);
  });
});

describe('getTopCategory', () => {
  it('returns the category with highest spend', () => {
    expect(getTopCategory(TX)).toBe('Food & Dining');
  });

  it('returns null for empty array', () => {
    expect(getTopCategory([])).toBeNull();
  });

  it('returns null when only income exists', () => {
    const incomeOnly = TX.filter((t) => t.type === 'income');
    expect(getTopCategory(incomeOnly)).toBeNull();
  });

  it('returns single category when only one expense', () => {
    const single = [{ id: 'z', type: 'expense', amount: 50, category: 'Transport', note: '', date: '2026-11-01' }];
    expect(getTopCategory(single)).toBe('Transport');
  });
});
