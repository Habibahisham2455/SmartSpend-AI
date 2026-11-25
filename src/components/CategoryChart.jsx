import { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { CATEGORIES } from '../data/categories';
import { formatCurrency, formatPercent } from '../utils/formatters';

const colorMap = Object.fromEntries(CATEGORIES.map((c) => [c.label, c.color]));

function CustomTooltip({ active, payload, total }) {
  if (active && payload && payload.length) {
    const { name, value, payload: itemPayload } = payload[0];
    const pct = formatPercent(value, total);
    return (
      <div className="bg-slate-900/95 text-white border border-slate-700 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs space-y-1">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: itemPayload.fill }}
          />
          <span className="font-bold text-sm">{name}</span>
        </div>
        <p className="text-slate-300 font-medium">{formatCurrency(value)} ({pct})</p>
      </div>
    );
  }
  return null;
}

// CategoryChart: data = [{ category, total }], onSelectCategory (function)
export default function CategoryChart({ data = [], onSelectCategory }) {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-sm">
        <p>No spending recorded for this month.</p>
        <span className="text-xs text-slate-500 mt-1">Expenses will appear here broken down by category.</span>
      </div>
    );
  }

  const totalExpense = data.reduce((sum, item) => sum + (Number(item.total) || 0), 0);

  const chartData = data.map((d) => ({
    name: d.category,
    value: d.total,
    fill: colorMap[d.category] ?? '#8C52FF',
  }));

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Donut Chart with Center Total */}
      <div className="relative w-full md:w-1/2 h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={3}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              onClick={(entry) => onSelectCategory && onSelectCategory(entry.name)}
              cursor="pointer"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={entry.fill}
                  stroke={activeIndex === index ? '#FFFFFF' : 'transparent'}
                  strokeWidth={activeIndex === index ? 3 : 0}
                  className="transition-all duration-300"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip total={totalExpense} />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Donut Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Spent
          </span>
          <span className="text-xl font-black text-[var(--text-main)] tracking-tight">
            {formatCurrency(totalExpense)}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {chartData.length} categories
          </span>
        </div>
      </div>

      {/* Legend / Category Breakdown List */}
      <div className="w-full md:w-1/2 space-y-2.5 max-h-64 overflow-y-auto pr-1">
        {chartData.map((item, idx) => {
          const pct = formatPercent(item.value, totalExpense);
          const isHovered = activeIndex === idx;
          return (
            <div
              key={item.name}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() => onSelectCategory && onSelectCategory(item.name)}
              className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                isHovered
                  ? 'bg-slate-100 dark:bg-slate-800 scale-[1.02]'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span
                  className="w-3 h-3 rounded-md shrink-0 shadow-sm"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-[var(--text-main)] truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-slate-400">{pct}</span>
                <span className="font-bold text-[var(--text-main)]">{formatCurrency(item.value)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
