/**
 * budget.js — Pure budget tracking functions for SmartSpend AI
 *
 * budgets: { [category: string]: limitAmount }
 * transactions: array of { id, type, amount, category, note, date }
 */

/**
 * Total amount spent in a given category for a specific year+month.
 * @param {Array} transactions
 * @param {string} category
 * @param {number} year
 * @param {number} month  1-indexed
 * @returns {number}
 */
export function getSpentByCategory(transactions, category, year, month) {
  return transactions
    .filter((tx) => {
      if (tx.type !== 'expense') return false;
      if (tx.category !== category) return false;
      const d = new Date(tx.date);
      return d.getUTCFullYear() === year && d.getUTCMonth() + 1 === month;
    })
    .reduce((sum, tx) => sum + tx.amount, 0);
}

/**
 * Build a budget status report for all budget categories.
 * @param {Array} transactions
 * @param {Object} budgets  { [category]: limit }
 * @param {number} year
 * @param {number} month  1-indexed
 * @returns {Array<{ category: string, limit: number, spent: number, percent: number, status: 'ok'|'warning'|'danger' }>}
 */
export function getBudgetStatus(transactions, budgets, year, month) {
  return Object.entries(budgets).map(([category, limit]) => {
    const spent = getSpentByCategory(transactions, category, year, month);
    const percent = limit > 0 ? (spent / limit) * 100 : 0;
    let status = 'ok';
    if (percent >= 100) status = 'danger';
    else if (percent >= 80) status = 'warning';
    return { category, limit, spent, percent, status };
  });
}

/**
 * Return only budget categories that are at warning (≥80%) or danger (≥100%) level.
 * @param {Array} transactions
 * @param {Object} budgets
 * @param {number} year
 * @param {number} month  1-indexed
 * @returns {Array}
 */
export function getCategoryAlerts(transactions, budgets, year, month) {
  return getBudgetStatus(transactions, budgets, year, month).filter(
    (item) => item.status === 'warning' || item.status === 'danger'
  );
}
