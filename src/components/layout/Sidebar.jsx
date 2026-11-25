import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  Target,
  Info,
  Plus,
  Sparkles,
} from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import Button from '../ui/Button';

// Sidebar: theme ('light'|'dark'), onToggleTheme (function), onOpenQuickAdd (function)
export default function Sidebar({ theme, onToggleTheme, onOpenQuickAdd }) {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
    { to: '/budgets', label: 'Budgets', icon: PiggyBank },
    { to: '/goals', label: 'Savings Goals', icon: Target },
    { to: '/about', label: 'About & Pitch', icon: Info },
  ];

  return (
    <aside
      className="hidden md:flex flex-col w-64 bg-[var(--surface-card)] border-r border-[var(--border-subtle)] min-h-screen p-5 shrink-0 sticky top-0 transition-colors"
      aria-label="Main Navigation"
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white shadow-md shadow-[#8C52FF]/30">
          <Sparkles className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <span className="text-lg font-black tracking-tight text-[var(--text-main)]">
            SmartSpend <span className="text-brand-gradient">AI</span>
          </span>
          <span className="block text-[10px] font-semibold tracking-wider uppercase text-slate-400">
            Personal Finance
          </span>
        </div>
      </div>

      {/* Quick Add CTA Button */}
      <div className="mb-6 px-1">
        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={onOpenQuickAdd}
          className="w-full justify-center shadow-lg shadow-[#8C52FF]/20"
        >
          Add Transaction
        </Button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5" aria-label="Sidebar Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-gradient text-white shadow-md shadow-[#8C52FF]/25 translate-x-1'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Footer & Theme Toggle */}
      <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between px-2">
        <span className="text-xs text-slate-500 font-medium">Theme Mode</span>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </aside>
  );
}
