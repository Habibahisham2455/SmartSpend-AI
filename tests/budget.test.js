import { describe, it, expect } from 'vitest';
import {
  getSpentByCategory,
  getBudgetStatus,
  getCategoryAlerts,
} from '../src/utils/budget.js';

const TX = [
  { id: '1', type: 'expense', amount: 300, category: 'Food & Dining', note: '', date: '2026-11-05' },
  { id: '2', type: 'expense', amount: 100, category: 'Food & Dining', note: '', date: '2026-11-15' },
  { id: '3', type: 'expense', amount:  50, category: 'Transport',     note: '', date: '2026-11-10' },
  { id: '4', type: 'expense', amount: 200, category: 'Shopping',      note: '', date: '2026-11-20' },
  { id: '5', type: 'income',  amount: 500, category: 'Food & Dining', note: '', date: '2026-11-01' }, // income excluded
  { id: '6', type: 'expense', amount:  80, category: 'Food & Dining', note: '', date: '2026-10-20' }, // Oct – excluded
];

const BUDGETS = {
  'Food & Dining': 400, // 400/400 = 100% → danger
  'Transport':     100, // 50/100  = 50%  → ok
  'Shopping':      210, // 200/210 ≈ 95%  → warning
};

describe('getSpentByCategory', () => {
  it('sums expenses for the given category and month', () => {
    expect(getSpentByCategory(TX, 'Food & Dining', 2026, 11)).toBe(400);
  });

  it('excludes income transactions', () => {
    // income tx for Food & Dining should be ignored
    expect(getSpentByCategory(TX, 'Food & Dining', 2026, 11)).toBe(400);
  });

  it('excludes transactions from other months', () => {
    // Oct Food & Dining = 80, but Nov = 400
    expect(getSpentByCategory(TX, 'Food & Dining', 2026, 10)).toBe(80);
  });

  it('returns 0 for a category with no transactions', () => {
    expect(getSpentByCategory(TX, 'Healthcare', 2026, 11)).toBe(0);
  });

  it('returns 0 for empty transactions array', () => {
    expect(getSpentByCategory([], 'Food & Dining', 2026, 11)).toBe(0);
  });
});

describe('getBudgetStatus', () => {
  it('returns one entry per budget category', () => {
    const result = getBudgetStatus(TX, BUDGETS, 2026, 11);
    expect(result).toHaveLength(3);
  });

  it('marks danger when spent >= limit (100%)', () => {
    const result = getBudgetStatus(TX, BUDGETS, 2026, 11);
    const food = result.find((r) => r.category === 'Food & Dining');
    expect(food.status).toBe('danger');
    expect(food.spent).toBe(400);
    expect(food.limit).toBe(400);
    expect(food.percent).toBeCloseTo(100);
  });

  it('marks warning when 80% <= spent < 100%', () => {
    const result = getBudgetStatus(TX, BUDGETS, 2026, 11);
    const shopping = result.find((r) => r.category === 'Shopping');
    expect(shopping.status).toBe('warning');
  });

  it('marks ok when spent < 80%', () => {
    const result = getBudgetStatus(TX, BUDGETS, 2026, 11);
    const transport = result.find((r) => r.category === 'Transport');
    expect(transport.status).toBe('ok');
    expect(transport.spent).toBe(50);
  });

  it('returns empty array for empty budgets', () => {
    expect(getBudgetStatus(TX, {}, 2026, 11)).toEqual([]);
  });

  it('handles zero limit gracefully (0%)', () => {
    const result = getBudgetStatus(TX, { 'Food & Dining': 0 }, 2026, 11);
    expect(result[0].percent).toBe(0);
    expect(result[0].status).toBe('ok');
  });
});

describe('getCategoryAlerts', () => {
  it('returns only warning and danger items', () => {
    const result = getCategoryAlerts(TX, BUDGETS, 2026, 11);
    const statuses = result.map((r) => r.status);
    expect(statuses).not.toContain('ok');
    expect(statuses).toContain('warning');
    expect(statuses).toContain('danger');
  });

  it('returns empty array when all categories are ok', () => {
    const lowSpendTx = [
      { id: 'a', type: 'expense', amount: 10, category: 'Food & Dining', note: '', date: '2026-11-01' },
    ];
    const result = getCategoryAlerts(lowSpendTx, { 'Food & Dining': 400 }, 2026, 11);
    expect(result).toEqual([]);
  });

  it('returns empty array for empty transactions', () => {
    const result = getCategoryAlerts([], BUDGETS, 2026, 11);
    // All spent = 0, all ok
    expect(result).toEqual([]);
  });
});
