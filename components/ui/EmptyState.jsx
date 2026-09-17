import { Inbox, Droplets, Bell, BarChart2, Users, Search, AlertCircle, RefreshCw } from 'lucide-react';

const ICON_MAP = {
  default:       Inbox,
  donations:     Droplets,
  notifications: Bell,
  campaigns:     BarChart2,
  donors:        Users,
  search:        Search,
};

/* ── EmptyState ── */
export function EmptyState({
  icon = 'default',
  title = 'Nothing here yet',
  description = 'There is no data to display right now.',
  action,
  actionLabel = 'Get Started',
  size = 'md',
}) {
  const Icon = typeof icon === 'string' ? (ICON_MAP[icon] || Inbox) : icon;
  const iconSize = size === 'sm' ? 56 : 72;
  const paddingY = size === 'sm' ? 32 : 56;

  return (
    <div className="empty-state" style={{ paddingTop: paddingY, paddingBottom: paddingY }}>
      <div
        className="empty-state-icon"
        style={{ width: iconSize, height: iconSize }}
      >
        <Icon size={size === 'sm' ? 24 : 32} strokeWidth={1.5} />
      </div>
      <div className="empty-state-title" style={{ fontSize: size === 'sm' ? 15 : 18 }}>
        {title}
      </div>
      <div className="empty-state-desc">
        {description}
      </div>
      {action && (
        <button className="btn btn-primary" onClick={action}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/* ── ErrorState ── */
export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this data. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
  size = 'md',
}) {
  const paddingY = size === 'sm' ? 32 : 56;

  return (
    <div className="empty-state" style={{ paddingTop: paddingY, paddingBottom: paddingY }}>
      <div
        className="empty-state-icon"
        style={{
          background: 'var(--danger-light)',
          color: 'var(--red-500)',
          width: size === 'sm' ? 56 : 72,
          height: size === 'sm' ? 56 : 72,
        }}
      >
        <AlertCircle size={size === 'sm' ? 24 : 32} strokeWidth={1.5} />
      </div>
      <div className="empty-state-title" style={{ color: 'var(--gray-800)' }}>
        {title}
      </div>
      <div className="empty-state-desc">
        {description}
      </div>
      {onRetry && (
        <button className="btn btn-secondary" onClick={onRetry}>
          <RefreshCw size={14} />
          {retryLabel}
        </button>
      )}
    </div>
  );
}
