import { Sun, Moon } from 'lucide-react';

// ThemeToggle: theme ('light'|'dark'), onToggle (function)
export default function ThemeToggle({ theme = 'light', onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8C52FF]"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 text-slate-600 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
