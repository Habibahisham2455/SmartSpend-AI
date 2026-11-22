import { useState, useEffect } from 'react';

/**
 * useLocalStorage(key, initialValue)
 * Persists state to localStorage. Falls back to initialValue on first use
 * or if the stored value is corrupt / unparseable.
 *
 * @param {string} key           - localStorage key
 * @param {*}      initialValue  - value to use when nothing is stored yet
 * @returns {[*, Function]}      - [storedValue, setValue]
 */
export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Keep localStorage in sync whenever storedValue changes.
  useEffect(() => {
    try {
      if (storedValue === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch {
      // Quota exceeded or private-browsing — silently ignore.
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
