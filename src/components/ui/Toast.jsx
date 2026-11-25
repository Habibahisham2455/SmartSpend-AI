import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

// Toast: ToastProvider + useToast hook: showToast(message, type = 'success'|'warning'|'danger'|'info', undoAction)
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'success', undoAction = null) => {
      const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
      const newToast = { id, message, type, undoAction };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 4500);

      return id;
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-20 sm:bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
            danger: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
            info: <Info className="w-5 h-5 text-[#8C52FF] shrink-0" />,
          };

          return (
            <div
              key={toast.id}
              className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-[var(--surface-card)] text-[var(--text-main)] rounded-xl border border-[var(--border-subtle)] shadow-xl text-sm transition-all duration-200"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {icons[toast.type] || icons.info}
                <span className="font-medium truncate">{toast.message}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {toast.undoAction && (
                  <button
                    type="button"
                    onClick={() => {
                      toast.undoAction.onUndo();
                      removeToast(toast.id);
                    }}
                    className="text-xs font-bold text-[#8C52FF] hover:underline px-1.5 py-0.5 rounded cursor-pointer"
                  >
                    {toast.undoAction.label || 'Undo'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  aria-label="Dismiss notification"
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
