import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';
import QuickAddModal from './components/QuickAddModal';
import { ToastProvider } from './components/ui/Toast';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import BudgetsPage from './pages/BudgetsPage';
import GoalsPage from './pages/GoalsPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('smartspend:theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } catch {
      return 'light';
    }
  });

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('smartspend:theme', theme);
    } catch {
      // ignore
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex bg-[var(--bg-page)] text-[var(--text-main)] transition-colors duration-200">
        {/* Desktop Sidebar Navigation */}
        <Sidebar
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/budgets" element={<BudgetsPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <BottomNav onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

        {/* Global Quick Add Transaction Modal */}
        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
        />
      </div>
    </ToastProvider>
  );
}
