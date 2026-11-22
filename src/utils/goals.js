/**
 * goals.js — Pure savings-goal functions for SmartSpend AI
 *
 * goal: { id, name, targetAmount, savedAmount, createdAt }
 */

/**
 * Calculate goal progress as a percentage, capped at 100.
 * @param {{ targetAmount: number, savedAmount: number }} goal
 * @returns {number}  0-100
 */
export function getGoalProgress(goal) {
  if (!goal.targetAmount || goal.targetAmount <= 0) return 0;
  const percent = (goal.savedAmount / goal.targetAmount) * 100;
  return Math.min(Math.round(percent), 100);
}

/**
 * Estimate months remaining to reach the goal given a monthly contribution.
 * - Returns 0 if the goal is already met.
 * - Returns Infinity if monthlyContribution <= 0.
 * @param {{ targetAmount: number, savedAmount: number }} goal
 * @param {number} monthlyContribution
 * @returns {number}
 */
export function getMonthsToGoal(goal, monthlyContribution) {
  if (isGoalMet(goal)) return 0;
  if (!monthlyContribution || monthlyContribution <= 0) return Infinity;
  const remaining = goal.targetAmount - goal.savedAmount;
  return Math.ceil(remaining / monthlyContribution);
}

/**
 * Returns true if savedAmount has reached or exceeded targetAmount.
 * @param {{ targetAmount: number, savedAmount: number }} goal
 * @returns {boolean}
 */
export function isGoalMet(goal) {
  return goal.savedAmount >= goal.targetAmount;
}
