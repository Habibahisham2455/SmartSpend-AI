import { describe, it, expect } from 'vitest';
import {
  getGoalProgress,
  getMonthsToGoal,
  isGoalMet,
} from '../src/utils/goals.js';

const baseGoal = {
  id: 'goal-1',
  name: 'Emergency Fund',
  targetAmount: 1000,
  savedAmount: 400,
  createdAt: '2026-01-01',
};

describe('getGoalProgress', () => {
  it('calculates percent correctly', () => {
    expect(getGoalProgress(baseGoal)).toBe(40);
  });

  it('caps progress at 100 even when over-saved', () => {
    const over = { ...baseGoal, savedAmount: 1500 };
    expect(getGoalProgress(over)).toBe(100);
  });

  it('returns 0 when nothing saved', () => {
    const empty = { ...baseGoal, savedAmount: 0 };
    expect(getGoalProgress(empty)).toBe(0);
  });

  it('returns 0 when targetAmount is 0', () => {
    const zero = { ...baseGoal, targetAmount: 0 };
    expect(getGoalProgress(zero)).toBe(0);
  });

  it('returns 100 when goal is exactly met', () => {
    const met = { ...baseGoal, savedAmount: 1000 };
    expect(getGoalProgress(met)).toBe(100);
  });
});

describe('getMonthsToGoal', () => {
  it('calculates months needed correctly', () => {
    // remaining = 600, monthly = 100 → 6 months
    expect(getMonthsToGoal(baseGoal, 100)).toBe(6);
  });

  it('rounds up fractional months', () => {
    // remaining = 600, monthly = 350 → ceil(600/350) = 2
    expect(getMonthsToGoal(baseGoal, 350)).toBe(2);
  });

  it('returns 0 when goal is already met', () => {
    const met = { ...baseGoal, savedAmount: 1000 };
    expect(getMonthsToGoal(met, 100)).toBe(0);
  });

  it('returns Infinity when monthlyContribution is 0', () => {
    expect(getMonthsToGoal(baseGoal, 0)).toBe(Infinity);
  });

  it('returns Infinity when monthlyContribution is negative', () => {
    expect(getMonthsToGoal(baseGoal, -50)).toBe(Infinity);
  });

  it('returns Infinity when monthlyContribution is undefined', () => {
    expect(getMonthsToGoal(baseGoal, undefined)).toBe(Infinity);
  });

  it('returns 0 when savedAmount exceeds targetAmount', () => {
    const over = { ...baseGoal, savedAmount: 1200 };
    expect(getMonthsToGoal(over, 100)).toBe(0);
  });
});

describe('isGoalMet', () => {
  it('returns false when goal not yet met', () => {
    expect(isGoalMet(baseGoal)).toBe(false);
  });

  it('returns true when savedAmount equals targetAmount', () => {
    const met = { ...baseGoal, savedAmount: 1000 };
    expect(isGoalMet(met)).toBe(true);
  });

  it('returns true when savedAmount exceeds targetAmount', () => {
    const over = { ...baseGoal, savedAmount: 1500 };
    expect(isGoalMet(over)).toBe(true);
  });

  it('returns false when savedAmount is 0', () => {
    const empty = { ...baseGoal, savedAmount: 0 };
    expect(isGoalMet(empty)).toBe(false);
  });
});
