const TYPE_ICON = {
  info: '💡',
  warning: '⚠️',
  danger: '🔴',
};

const TYPE_STYLE = {
  info: 'bg-blue-500/10 border-blue-500/20 text-blue-200',
  warning: 'bg-yellow-400/10 border-yellow-400/20 text-yellow-200',
  danger: 'bg-red-500/10 border-red-500/20 text-red-200',
};

export default function InsightList({ insights }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Insights</h2>
        <span className="text-xs text-slate-600 italic">Rule-based insights — not AI</span>
      </div>

      {!insights || insights.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-sm">
          No insights for this month.
        </div>
      ) : (
        <div className="space-y-2">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm ${
                TYPE_STYLE[insight.type] ?? TYPE_STYLE.info
              }`}
            >
              <span className="shrink-0 mt-0.5">{TYPE_ICON[insight.type] ?? '💡'}</span>
              <p>{insight.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
