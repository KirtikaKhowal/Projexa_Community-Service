/* Skeleton shimmer is defined in index.css — this file just exports components */
export function Skeleton({ width = '100%', height = 16, className = '', style = {} }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ lines = 3, lastWidth = '60%' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="skeleton skeleton-text"
          width={i === lines - 1 && lines > 1 ? lastWidth : '100%'}
          height={14}
        />
      ))}
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="stat-card" style={{ pointerEvents: 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Skeleton className="skeleton" width={44} height={44} style={{ borderRadius: 12 }} />
        <Skeleton className="skeleton" width={52} height={22} style={{ borderRadius: 99 }} />
      </div>
      <Skeleton className="skeleton skeleton-title" width={64} height={26} style={{ marginBottom: 6 }} />
      <Skeleton className="skeleton skeleton-text" width={100} height={12} />
    </div>
  );
}

export function SkeletonCard({ height = 120 }) {
  return (
    <div className="card card-p" style={{ pointerEvents: 'none' }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'center' }}>
        <Skeleton className="skeleton skeleton-avatar" width={44} height={44} />
        <div style={{ flex: 1 }}>
          <Skeleton className="skeleton skeleton-title" width="70%" height={16} style={{ marginBottom: 6 }} />
          <Skeleton className="skeleton skeleton-text" width="50%" height={12} />
        </div>
      </div>
      <Skeleton className="skeleton" width="100%" height={height - 80} style={{ borderRadius: 10 }} />
    </div>
  );
}

export function SkeletonTableRow({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i}>
          <Skeleton className="skeleton skeleton-text" width={i === 0 ? '80%' : '60%'} height={14} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonTable({ rows = 4, cols = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonTableRow key={i} cols={cols} />
      ))}
    </>
  );
}
