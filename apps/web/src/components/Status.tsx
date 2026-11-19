export function Loading({
  label = 'Loading…',
  variant = 'grid',
}: {
  label?: string;
  variant?: 'grid' | 'pdp' | 'inline';
}) {
  if (variant === 'inline') {
    return (
      <div className="status-inline" role="status">
        <span className="spinner" aria-hidden />
        <span className="muted">{label}</span>
      </div>
    );
  }

  if (variant === 'pdp') {
    return (
      <div className="commerce-page page-enter" role="status" aria-busy="true">
        <p className="sr-only">{label}</p>
        <div className="skeleton-pdp" aria-hidden>
          <div className="skeleton-block skeleton-pdp-media" />
          <div className="skeleton-pdp-info">
            <div className="skeleton-line skeleton-line--lg" />
            <div className="skeleton-line skeleton-line--md" />
            <div className="skeleton-line skeleton-line--sm" />
            <div className="skeleton-block skeleton-pdp-copy" />
          </div>
          <div className="skeleton-block skeleton-pdp-buy" />
        </div>
      </div>
    );
  }

  return (
    <div className="status-block" role="status" aria-busy="true">
      <div className="status-inline status-inline--block">
        <span className="spinner" aria-hidden />
        <span className="muted">{label}</span>
      </div>
      <div className="skeleton-grid" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <div className="skeleton-tile" key={i}>
            <div className="skeleton-block skeleton-tile-media" />
            <div className="skeleton-tile-body">
              <div className="skeleton-line skeleton-line--lg" />
              <div className="skeleton-line skeleton-line--sm" />
              <div className="skeleton-line skeleton-line--price" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Empty({ label }: { label: string }) {
  return (
    <div className="empty-state" role="status">
      <p className="empty-state-title">Nothing here yet</p>
      <p className="muted">{label}</p>
    </div>
  );
}

export function ErrorText({ message }: { message: string }) {
  return (
    <p className="error status-block error-banner" role="alert">
      {message}
    </p>
  );
}
