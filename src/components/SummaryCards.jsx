import { formatCurrency } from '../utils/formatters';

function Card({ label, value, colorClass, icon }) {
  return (
    <div className={`rounded-2xl border p-5 flex flex-col gap-2 ${colorClass}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium opacity-80">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <span className="text-3xl font-black tracking-tight">{formatCurrency(value)}</span>
    </div>
  );
}

export default function SummaryCards({ income, expenses, balance }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card
        label="Income"
        value={income}
        icon="📈"
        colorClass="bg-green-500/10 border-green-500/30 text-green-300"
      />
      <Card
        label="Expenses"
        value={expenses}
        icon="📉"
        colorClass="bg-red-500/10 border-red-500/30 text-red-300"
      />
      <Card
        label="Balance"
        value={balance}
        icon="💰"
        colorClass="bg-blue-500/10 border-blue-500/30 text-blue-300"
      />
    </div>
  );
}
