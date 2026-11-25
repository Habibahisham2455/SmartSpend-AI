import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// Modal: isOpen (boolean), onClose (function), title (string), children, maxWidth ('sm'|'md'|'lg'|'xl')
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog box */}
      <div
        ref={modalRef}
        className={`relative w-full ${
          maxWidthClasses[maxWidth] || maxWidthClasses.md
        } bg-[var(--surface-card)] text-[var(--text-main)] rounded-2xl border border-[var(--border-subtle)] shadow-2xl p-6 overflow-hidden z-10 transition-all duration-200 transform scale-100 max-h-[90vh] flex flex-col`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <h2 id="modal-title" className="text-xl font-bold tracking-tight">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="pt-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
