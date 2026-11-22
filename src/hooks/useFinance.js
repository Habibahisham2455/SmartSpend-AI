import { useContext } from 'react';
import { FinanceContext } from '../context/FinanceContext';

/**
 * useFinance()
 * Convenience hook that returns the full FinanceContext value.
 * Throws a descriptive error if used outside <FinanceProvider>.
 */
export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a <FinanceProvider>');
  }
  return context;
}

export default useFinance;
