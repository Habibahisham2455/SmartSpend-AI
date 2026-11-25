// PageHeader: title (string), subtitle (string), actions (ReactNode)
export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-2 border-b border-[var(--border-subtle)]">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-main)]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
