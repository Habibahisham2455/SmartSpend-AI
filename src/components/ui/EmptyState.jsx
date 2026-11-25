import Button from './Button';

// EmptyState: icon, title, description, actionLabel, onAction, className
export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-[var(--surface-card)]/50 ${className}`}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-[#8C52FF]/10 flex items-center justify-center text-[#8C52FF] mb-4">
          <Icon className="w-7 h-7" aria-hidden="true" />
        </div>
      )}
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-5">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
