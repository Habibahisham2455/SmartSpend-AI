import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  Target,
  Plus,
} from 'lucide-react';

// BottomNav: onOpenQuickAdd (function)
export default function BottomNav({ onOpenQuickAdd }) {
  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/transactions', label: 'Spend', icon: ArrowLeftRight },
    { to: '/budgets', label: 'Budgets', icon: PiggyBank },
    { to: '/goals', label: 'Goals', icon: Target },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface-card)]/95 backdrop-blur-md border-t border-[var(--border-subtle)] px-3 py-2 flex items-center justify-around shadow-2xl"
    >
      {navItems.slice(0, 2).map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-semibold transition-colors ${
                isActive
                  ? 'text-[#8C52FF] font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`
            }
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}

      {/* Center Floating Quick-Add button */}
      <button
        type="button"
        onClick={onOpenQuickAdd}
        aria-label="Quick add transaction"
        className="w-12 h-12 -mt-5 rounded-full bg-brand-gradient text-white flex items-center justify-center shadow-lg shadow-[#8C52FF]/40 active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6" aria-hidden="true" />
      </button>

      {navItems.slice(2).map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-semibold transition-colors ${
                isActive
                  ? 'text-[#8C52FF] font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`
            }
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
