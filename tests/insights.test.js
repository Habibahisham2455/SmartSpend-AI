import { describe, it, expect } from 'vitest';
import { getInsights } from '../src/utils/insights.js';

// Fixed month: November 2026 (past month — full 30 days elapsed)
const YEAR = 2026;
const MONTH = 11;

const BASE_TX = [
  // Income
  { id: 'i1', type: 'income',  amount: 2000, category: 'Salary',       note: '', date: '2026-11-01' },
  // Expenses
  { id: 'e1', type: 'expense', amount:  500, category: 'Food & Dining', note: '', date: '2026-11-05' },
  { id: 'e2', type: 'expense', amount:  200, category: 'Transport',     note: '', date: '2026-11-10' },
  { id: 'e3', type: 'expense', amount:  150, category: 'Entertainment', note: '', date: '2026-11-15' },
];

const BUDGETS = {
  'Food & Dining': 600,  // 500/600 ≈ 83% → warning
  'Transport':     500,  // 200/500 = 40% → ok
  'Entertainment': 100,  // 150/100 = 150% → danger
};

const GOALS = [];

describe('getInsights — Rule 1: top category', () => {
  it('includes top-category insight when expenses exist', () => {
    const result = getInsights({ transactions: BASE_TX, budgets: {}, goals: GOALS, year: YEAR, month: MONTH });
    const topCat = result.find((i) => i.message.includes('biggest spend'));
    expect(topCat).toBeDefined();
    expect(topCat.type).toBe('info');
    expect(topCat.message).toContain('Food & Dining');
  });

  it('omits top-category insight when no expenses', () => {
    const incomeOnly = BASE_TX.filter((t) => t.type === 'income');
    const result = getInsights({ transactions: incomeOnly, budgets: {}, goals: GOALS, year: YEAR, month: MONTH });
    expect(result.find((i) => i.message.includes('biggest spend'))).toBeUndefined();
  });
});

describe('getInsights — Rule 2: small purchases', () => {
  it('flags small purchases that sum above $50', () => {
    const smallTx = [
      ...BASE_TX,
      { id: 's1', type: 'expense', amount: 8,  category: 'Coffee & Drinks', note: '', date: '2026-11-02' },
      { id: 's2', type: 'expense', amount: 9,  category: 'Coffee & Drinks', note: '', date: '2026-11-03' },
      { id: 's3', type: 'expense', amount: 7,  category: 'Coffee & Drinks', note: '', date: '2026-11-04' },
      { id: 's4', type: 'expense', amount: 9,  category: 'Coffee & Drinks', note: '', date: '2026-11-06' },
      { id: 's5', type: 'expense', amount: 9,  category: 'Coffee & Drinks', note: '', date: '2026-11-07' },
      { id: 's6', type: 'expense', amount: 9,  category: 'Coffee & Drinks', note: '', date: '2026-11-08' },
    ]; // 8+9+7+9+9+9 = 51 > 50
    const result = getInsights({ transactions: smallTx, budgets: {}, goals: GOALS, year: YEAR, month: MONTH });
    const smallInsight = result.find((i) => i.message.includes('Small purchases'));
    expect(smallInsight).toBeDefined();
    expect(smallInsight.type).toBe('warning');
  });

  it('does NOT flag small purchases when sum <= $50', () => {
    const smallTx = [
      ...BASE_TX,
      { id: 's1', type: 'expense', amount: 5, category: 'Coffee & Drinks', note: '', date: '2026-11-02' },
    ]; // only $5 total small
    const result = getInsights({ transactions: smallTx, budgets: {}, goals: GOALS, year: YEAR, month: MONTH });
    expect(result.find((i) => i.message.includes('Small purchases'))).toBeUndefined();
  });
});

describe('getInsights — Rule 3: overspend pace', () => {
  it('flags overspend pace when projected spending exceeds income', () => {
    // Use a past month: days elapsed = all 30 days
    // income = 100, expenses = 500 → pace > income → flagged
    const tx = [
      { id: 'i1', type: 'income',  amount: 100, category: 'Salary', note: '', date: '2026-11-01' },
      { id: 'e1', type: 'expense', amount: 500, category: 'Food & Dining', note: '', date: '2026-11-10' },
    ];
    const result = getInsights({ transactions: tx, budgets: {}, goals: GOALS, year: YEAR, month: MONTH });
    const paceInsight = result.find((i) => i.message.includes('overspend'));
    expect(paceInsight).toBeDefined();
    expect(paceInsight.type).toBe('danger');
  });

  it('does NOT flag overspend when spending pace is within income', () => {
    // income = 5000, expenses = 500 → no overspend
    const tx = [
      { id: 'i1', type: 'income',  amount: 5000, category: 'Salary',       note: '', date: '2026-11-01' },
      { id: 'e1', type: 'expense', amount:  500, category: 'Food & Dining', note: '', date: '2026-11-10' },
    ];
    const result = getInsights({ transactions: tx, budgets: {}, goals: GOALS, year: YEAR, month: MONTH });
    expect(result.find((i) => i.message.includes('overspend'))).toBeUndefined();
  });
});

describe('getInsights — Rule 4: budget alerts', () => {
  it('includes warning message for category at ≥80%', () => {
    const result = getInsights({ transactions: BASE_TX, budgets: BUDGETS, goals: GOALS, year: YEAR, month: MONTH });
    const warning = result.find((i) => i.type === 'warning' && i.message.includes('Food & Dining'));
    expect(warning).toBeDefined();
  });

  it('includes danger message for category at ≥100%', () => {
    const result = getInsights({ transactions: BASE_TX, budgets: BUDGETS, goals: GOALS, year: YEAR, month: MONTH });
    const danger = result.find((i) => i.type === 'danger' && i.message.includes('Entertainment'));
    expect(danger).toBeDefined();
  });

  it('does NOT include budget messages for ok categories', () => {
    const result = getInsights({ transactions: BASE_TX, budgets: BUDGETS, goals: GOALS, year: YEAR, month: MONTH });
    const transportMsg = result.find((i) => i.message.includes('Transport') && (i.type === 'warning' || i.type === 'danger'));
    expect(transportMsg).toBeUndefined();
  });

  it('returns no budget insights when budgets is empty', () => {
    const result = getInsights({ transactions: BASE_TX, budgets: {}, goals: GOALS, year: YEAR, month: MONTH });
    const budgetInsights = result.filter((i) => i.message.includes('budget'));
    expect(budgetInsights).toHaveLength(0);
  });
});

describe('getInsights — edge cases', () => {
  it('returns empty array for empty transactions and budgets', () => {
    const result = getInsights({ transactions: [], budgets: {}, goals: [], year: YEAR, month: MONTH });
    expect(result).toEqual([]);
  });

  it('every insight has id, type, and message fields', () => {
    const result = getInsights({ transactions: BASE_TX, budgets: BUDGETS, goals: GOALS, year: YEAR, month: MONTH });
    for (const insight of result) {
      expect(insight).toHaveProperty('id');
      expect(insight).toHaveProperty('type');
      expect(insight).toHaveProperty('message');
      expect(['info', 'warning', 'danger']).toContain(insight.type);
    }
  });
});
