// ProgressBar: value (0-100), colorClass (string), height ('sm'|'md'|'lg'), label (string), showValue (boolean)
export default function ProgressBar({
  value = 0,
  colorClass = 'bg-brand-gradient',
  height = 'md',
  label,
  showValue = false,
  className = '',
}) {
  const clamped = Math.min(100, Math.max(0, Number(value) || 0));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs font-semibold mb-1.5 text-slate-600 dark:text-slate-300">
          {label && <span>{label}</span>}
          {showValue && <span>{Math.round(clamped)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${
          heightClasses[height] || heightClasses.md
        }`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
