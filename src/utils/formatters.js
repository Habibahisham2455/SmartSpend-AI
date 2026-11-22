/**
 * formatters.js — Pure formatting utility functions for SmartSpend AI
 */

/**
 * Format a number as a currency string.
 * @param {number} amount
 * @param {string} currency
 * @returns {string} e.g. "$1,234.56"
 */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format an ISO date string as a short date.
 * @param {string} isoString
 * @returns {string} e.g. "Nov 22, 2026"
 */
export function formatDate(isoString) {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/**
 * Format an ISO date string as a long month + year.
 * @param {string} isoString
 * @returns {string} e.g. "November 2026"
 */
export function formatMonth(isoString) {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/**
 * Format a percentage value relative to a total.
 * Guards against divide-by-zero.
 * @param {number} value
 * @param {number} total
 * @returns {string} e.g. "45%"
 */
export function formatPercent(value, total) {
  if (!total || total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}
