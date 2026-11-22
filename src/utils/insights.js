/**
 * insights.js — Rule-based financial insight generator for SmartSpend AI
 * NOT an LLM — deterministic rules only.
 */

import { getTopCategory, getTotalIncome } from './calculations.js';
import { getBudgetStatus } from './budget.js';
import { formatCurrency } from './formatters.js';

/**
 * Generate a list of insight objects for the given month.
 *
 * @param {{
 *   transactions: Array,
 *   budgets: Object,
 *   goals: Array,
 *   year: number,
 *   month: number   // 1-indexed
 * }} params
 * @returns {Array<{ id: string, type: 'info'|'warning'|'danger', message: string }>}
 */
export function getInsights({ transactions, budgets, goals, year, month }) {
  void goals;
  const insights = [];
  let idCounter = 1;

  // Filter transactions to the given month
  const monthTx = transactions.filter((tx) => {
    const d = new Date(tx.date);
    return d.getUTCFullYear() === year && d.getUTCMonth() + 1 === month;
  });

  // ── Rule 1: Top spend category ──────────────────────────────────────────────
  const topCategory = getTopCategory(monthTx);
  if (topCategory) {
    insights.push({
      id: `insight-${idCounter++}`,
      type: 'info',
      message: `Your biggest spend is ${topCategory} this month.`,
    });
  }

  // ── Rule 2: Small purchases accumulation ────────────────────────────────────
  const smallPurchases = monthTx.filter(
    (tx) => tx.type === 'expense' && tx.amount < 10
  );
  const smallTotal = smallPurchases.reduce((sum, tx) => sum + tx.amount, 0);
  if (smallTotal > 50) {
    insights.push({
      id: `insight-${idCounter++}`,
      type: 'warning',
      message: `Small purchases under $10 added up to ${formatCurrency(smallTotal)} this month.`,
    });
  }

  // ── Rule 3: Spending pace vs income ─────────────────────────────────────────
  const today = new Date();
  // Days elapsed: how many days have passed in the month (at least 1)
  let daysElapsed;
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month;

  if (isCurrentMonth) {
    daysElapsed = Math.max(today.getDate(), 1);
  } else {
    // For past months: treat as fully elapsed (last day of that month)
    daysElapsed = new Date(year, month, 0).getDate();
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  const totalSpentSoFar = monthTx
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const projectedSpend = (totalSpentSoFar / daysElapsed) * daysInMonth;
  const totalIncome = getTotalIncome(monthTx);

  if (projectedSpend > totalIncome) {
    const overspend = projectedSpend - totalIncome;
    insights.push({
      id: `insight-${idCounter++}`,
      type: 'danger',
      message: `At this pace you may overspend by ${formatCurrency(overspend)} by month end.`,
    });
  }

  // ── Rule 4: Budget warnings per category ────────────────────────────────────
  if (budgets && Object.keys(budgets).length > 0) {
    const statuses = getBudgetStatus(transactions, budgets, year, month);
    for (const item of statuses) {
      if (item.status === 'warning') {
        insights.push({
          id: `insight-${idCounter++}`,
          type: 'warning',
          message: `You've used ${Math.round(item.percent)}% of your ${item.category} budget.`,
        });
      } else if (item.status === 'danger') {
        insights.push({
          id: `insight-${idCounter++}`,
          type: 'danger',
          message: `You've exceeded your ${item.category} budget (${Math.round(item.percent)}% used).`,
        });
      }
    }
  }

  return insights;
}
