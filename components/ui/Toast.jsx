import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

/* ── Context ── */
const ToastContext = createContext(null);

let uid = 0;

const ICONS = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
};

/* ── Single Toast ── */
function Toast({ toast, onRemove }) {
  const Icon = ICONS[toast.type] || Info;

  return (
    <div
      className={`toast toast-${toast.type}${toast.exiting ? ' exiting' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <div className="toast-icon">
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="toast-title">{toast.title}</div>
        {toast.message && <div className="toast-message">{toast.message}</div>}
      </div>
      <button
        className="toast-close"
        onClick={() => onRemove(toast.id)}
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
      <div className="toast-progress" style={{ animationDuration: `${toast.duration}ms` }} />
    </div>
  );
}

/* ── Provider ── */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const remove = useCallback((id) => {
    // mark as exiting first for animation
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
    if (timers.current[id]) clearTimeout(timers.current[id]);
  }, []);

  const add = useCallback(({ type = 'info', title, message, duration = 3500 }) => {
    const id = ++uid;
    setToasts(prev => [...prev.slice(-4), { id, type, title, message, duration, exiting: false }]);
    timers.current[id] = setTimeout(() => remove(id), duration);
    return id;
  }, [remove]);

  return (
    <ToastContext.Provider value={{ add, remove }}>
      {children}
      <div className="toast-container" aria-label="Notifications">
        {toasts.map(t => (
          <Toast key={t.id} toast={t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ── Hook ── */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');

  return {
    success: (title, message) => ctx.add({ type: 'success', title, message }),
    error:   (title, message) => ctx.add({ type: 'error',   title, message }),
    warning: (title, message) => ctx.add({ type: 'warning', title, message }),
    info:    (title, message) => ctx.add({ type: 'info',    title, message }),
    dismiss: ctx.remove,
  };
}
