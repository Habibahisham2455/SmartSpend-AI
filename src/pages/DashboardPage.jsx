import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, PiggyBank, Target } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { getMonthlyTotals, getByCategory } from '../utils/calculations';
import { getCategoryAlerts, getBudgetStatus } from '../utils/budget';
import { getInsights } from '../utils/insights';
import { getGoalProgress } from '../utils/goals';
import { formatCurrency } from '../utils/formatters';
import PageHeader from '../components/layout/PageHeader';
import DashboardHero from '../components/DashboardHero';
import CategoryChart from '../components/CategoryChart';
import MonthlyBarChart from '../components/MonthlyBarChart';
import AlertBanner from '../components/AlertBanner';
import InsightList from '../components/InsightList';
import RecentTransactions from '../components/RecentTransactions';
import QuickAddModal from '../components/QuickAddModal';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { transactions, budgets, goals } = useFinance();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Compute for current active month (e.g. Nov 2026)
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { income, expenses, balance } = getMonthlyTotals(transactions, year, month);

  // Current month transactions
  const currentMonthTx = transactions.filter((tx) => {
    const d = new Date(tx.date);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });

  const byCategory = getByCategory(currentMonthTx);
  const alerts = getCategoryAlerts(transactions, budgets, year, month);
  const insights = getInsights({ transactions, budgets, goals, year, month });
  const budgetStatuses = getBudgetStatus(transactions, budgets, year, month);

  // Multi-month comparison for the bar chart (last 3 months)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const trendData = [];
  for (let i = 2; i >= 0; i--) {
    const d = new Date(year, month - 1 - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const totals = getMonthlyTotals(transactions, y, m);
    trendData.push({
      month: `${monthNames[m - 1]} ${y}`,
      income: totals.income,
      expenses: totals.expenses,
    });
  }

  const handleSelectCategory = (categoryName) => {
    navigate(`/transactions?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        subtitle={`Summary for ${monthNames[month - 1]} ${year}`}
        actions={
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setIsQuickAddOpen(true)}
          >
            Add Transaction
          </Button>
        }
      />

      {/* Over-budget alerts */}
      {alerts.length > 0 && <AlertBanner alerts={alerts} />}

      {/* Hero Balance Card */}
      <DashboardHero
        income={income}
        expenses={expenses}
        balance={balance}
        onQuickAdd={() => setIsQuickAddOpen(true)}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Charts & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Spending by Category Donut Chart */}
          <Card padding="md">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-subtle)]">
              <div>
                <h3 className="text-base font-bold text-[var(--text-main)]">
                  Spending by Category
                </h3>
                <p className="text-xs text-slate-400">
                  Click a category slice to inspect transactions
                </p>
              </div>
            </div>
            <CategoryChart data={byCategory} onSelectCategory={handleSelectCategory} />
          </Card>

          {/* Monthly Comparison Cashflow Bar Chart */}
          <Card padding="md">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-subtle)]">
              <div>
                <h3 className="text-base font-bold text-[var(--text-main)]">
                  Cashflow Trend
                </h3>
                <p className="text-xs text-slate-400">
                  Monthly income vs expense comparison
                </p>
              </div>
            </div>
            <MonthlyBarChart data={trendData} />
          </Card>
        </div>

        {/* Right Column: Tips, Recent Activity, and Mini Widgets */}
        <div className="space-y-6">
          {/* Rule-Based Smart Tips */}
          <InsightList insights={insights} />

          {/* Recent Transactions Preview */}
          <RecentTransactions transactions={transactions} />

          {/* Top Budgets Widget */}
          {budgetStatuses.length > 0 && (
            <Card padding="md">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <PiggyBank className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text-main)]">Active Budgets</h3>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/budgets')}
                  className="text-xs font-bold text-[#8C52FF] hover:underline cursor-pointer"
                >
                  Manage
                </button>
              </div>

              <div className="space-y-3.5">
                {budgetStatuses.slice(0, 3).map((item) => (
                  <div key={item.category} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[var(--text-main)]">{item.category}</span>
                      <span className="text-slate-500">
                        {formatCurrency(item.spent)} / {formatCurrency(item.limit)}
                      </span>
                    </div>
                    <ProgressBar
                      value={item.percent}
                      colorClass={
                        item.status === 'danger'
                          ? 'bg-rose-500'
                          : item.status === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }
                      height="sm"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Goals Widget */}
          {goals && goals.length > 0 && (
            <Card padding="md">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text-main)]">Savings Goals</h3>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/goals')}
                  className="text-xs font-bold text-[#8C52FF] hover:underline cursor-pointer"
                >
                  View all
                </button>
              </div>

              <div className="space-y-3">
                {goals.slice(0, 2).map((goal) => {
                  const progress = getGoalProgress(goal);
                  return (
                    <div key={goal.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-[var(--text-main)]">{goal.name}</span>
                        <span className="text-slate-500">{progress}%</span>
                      </div>
                      <ProgressBar value={progress} colorClass="bg-brand-gradient" height="sm" />
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </div>
  );
}
