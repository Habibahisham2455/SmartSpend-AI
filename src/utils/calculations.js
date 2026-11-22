/**
 * calculations.js — Pure financial calculation functions for SmartSpend AI
 * Operates on transaction objects: { id, type: 'income'|'expense', amount, category, note, date }
 */

/**
 * Sum all income transaction amounts.
 * @param {Array} transactions
 * @returns {number}
 */
export function getTotalIncome(transactions) {
  return transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
}

/**
 * Sum all expense transaction amounts.
 * @param {Array} transactions
 * @returns {number}
 */
export function getTotalExpenses(transactions) {
  return transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
}

/**
 * Calculate balance: total income minus total expenses.
 * @param {Array} transactions
 * @returns {number}
 */
export function getBalance(transactions) {
  return getTotalIncome(transactions) - getTotalExpenses(transactions);
}

/**
 * Group expense transactions by category, sorted descending by total.
 * @param {Array} transactions
 * @returns {Array<{category: string, total: number}>}
 */
export function getByCategory(transactions) {
  const expenses = transactions.filter((tx) => tx.type === 'expense');
  const map = {};
  for (const tx of expenses) {
    map[tx.category] = (map[tx.category] || 0) + tx.amount;
  }
  return Object.entries(map)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

/**
 * Get income, expenses, and balance filtered to a specific year and month.
 * @param {Array} transactions
 * @param {number} year
 * @param {number} month  1-indexed (1 = January)
 * @returns {{ income: number, expenses: number, balance: number }}
 */
export function getMonthlyTotals(transactions, year, month) {
  const filtered = transactions.filter((tx) => {
    const d = new Date(tx.date);
    return d.getUTCFullYear() === year && d.getUTCMonth() + 1 === month;
  });
  const income = getTotalIncome(filtered);
  const expenses = getTotalExpenses(filtered);
  return { income, expenses, balance: income - expenses };
}

/**
 * Return the category string with the highest expense spend, or null if none.
 * @param {Array} transactions
 * @returns {string|null}
 */
export function getTopCategory(transactions) {
  const byCategory = getByCategory(transactions);
  return byCategory.length > 0 ? byCategory[0].category : null;
}
