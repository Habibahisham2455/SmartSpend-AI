// ProgressRing: progress (0-100), size (number), strokeWidth (number), color (string), children
export default function ProgressRing({
  progress = 0,
  size = 72,
  strokeWidth = 6,
  color = '#8C52FF',
  children,
}) {
  const clamped = Math.min(100, Math.max(0, Number(progress) || 0));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        aria-hidden="true"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-slate-800"
          fill="transparent"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          fill="transparent"
        />
      </svg>
      {/* Center label or content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            {Math.round(clamped)}%
          </span>
        )}
      </div>
    </div>
  );
}
