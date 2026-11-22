import { createContext, useReducer, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { SEED_TRANSACTIONS, SEED_BUDGETS, SEED_GOALS } from '../data/seedData';

// ─── Context ────────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export const FinanceContext = createContext(undefined);

// ─── Initial state helper ───────────────────────────────────────────────────
const DEFAULT_STATE = {
  transactions: SEED_TRANSACTIONS,
  budgets: SEED_BUDGETS,
  goals: SEED_GOALS,
};

// ─── Reducer ────────────────────────────────────────────────────────────────
function financeReducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION': {
      const newTx = {
        ...action.payload,
        id: crypto.randomUUID(),
      };
      return { ...state, transactions: [newTx, ...state.transactions] };
    }

    case 'DELETE_TRANSACTION': {
      return {
        ...state,
        transactions: state.transactions.filter((tx) => tx.id !== action.payload),
      };
    }

    case 'ADD_BUDGET': {
      const { category, limit } = action.payload;
      return {
        ...state,
        budgets: { ...state.budgets, [category]: limit },
      };
    }

    case 'DELETE_BUDGET': {
      const rest = { ...state.budgets };
      delete rest[action.payload];
      return { ...state, budgets: rest };
    }

    case 'ADD_GOAL': {
      const newGoal = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: action.payload.createdAt ?? new Date().toISOString().slice(0, 10),
        savedAmount: action.payload.savedAmount ?? 0,
      };
      return { ...state, goals: [...state.goals, newGoal] };
    }

    case 'UPDATE_GOAL': {
      const { id, savedAmount } = action.payload;
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === id ? { ...g, savedAmount } : g
        ),
      };
    }

    case 'DELETE_GOAL': {
      return {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.payload),
      };
    }

    default:
      return state;
  }
}

// ─── Provider ───────────────────────────────────────────────────────────────
export function FinanceProvider({ children }) {
  const [persisted, setPersisted] = useLocalStorage('smartspend:v1', null);

  // Seed on first load; otherwise restore from localStorage.
  const [state, dispatch] = useReducer(
    financeReducer,
    persisted ?? DEFAULT_STATE
  );

  // Persist to localStorage after every state change.
  useEffect(() => {
    setPersisted(state);
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    state,
    dispatch,
    transactions: state.transactions,
    budgets: state.budgets,
    goals: state.goals,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}
