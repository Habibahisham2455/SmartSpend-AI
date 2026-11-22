import { useFinance } from '../hooks/useFinance';
import { getMonthlyTotals, getByCategory } from '../utils/calculations';
import { getCategoryAlerts } from '../utils/budget';
import { getInsights } from '../utils/insights';
import SummaryCards from '../components/SummaryCards';
import CategoryChart from '../components/CategoryChart';
import AlertBanner from '../components/AlertBanner';
import InsightList from '../components/InsightList';

export default function DashboardPage() {
  const { transactions, budgets, goals } = useFinance();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { income, expenses, balance } = getMonthlyTotals(transactions, year, month);
  const byCategory = getByCategory(
    transactions.filter((tx) => {
      const d = new Date(tx.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    })
  );
  const alerts = getCategoryAlerts(transactions, budgets, year, month);
  const insights = getInsights({ transactions, budgets, goals, year, month });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-white">Dashboard</h1>

      {/* Alerts */}
      {alerts.length > 0 && <AlertBanner alerts={alerts} />}

      {/* Summary */}
      <SummaryCards income={income} expenses={expenses} balance={balance} />

      {/* Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Spending by Category</h2>
        <CategoryChart data={byCategory} />
      </div>

      {/* Insights */}
      <InsightList insights={insights} />
    </div>
  );
}
