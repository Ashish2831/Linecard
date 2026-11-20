export function SkeletonTile() {
  return (
    <div className="skeleton-tile" aria-hidden>
      <div className="skeleton-block skeleton-tile-media" />
      <div className="skeleton-tile-body">
        <div className="skeleton-line skeleton-line--lg" />
        <div className="skeleton-line skeleton-line--md" />
        <div className="skeleton-line skeleton-line--sm" />
        <div className="skeleton-line skeleton-line--price" />
      </div>
    </div>
  );
}

export function SkeletonProductGrid({ count = 5 }: { count?: number }) {
  return (
    <div className="skeleton-grid" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonTile key={i} />
      ))}
    </div>
  );
}

export function SkeletonShelf({
  titleWidth = '40%',
  count = 5,
}: {
  titleWidth?: string;
  count?: number;
}) {
  return (
    <section className="shelf shelf--loading" aria-hidden>
      <div className="shelf-head">
        <div className="skeleton-line skeleton-line--title" style={{ width: titleWidth }} />
        <div className="skeleton-line skeleton-line--md" />
      </div>
      <SkeletonProductGrid count={count} />
    </section>
  );
}

export function SkeletonPdp() {
  return (
    <div className="skeleton-pdp" aria-hidden>
      <div className="skeleton-block skeleton-pdp-media" />
      <div className="skeleton-pdp-info">
        <div className="skeleton-line skeleton-line--title" />
        <div className="skeleton-line skeleton-line--md" />
        <div className="skeleton-line skeleton-line--sm" />
        <div className="skeleton-block skeleton-pdp-copy" />
        <div className="skeleton-block skeleton-pdp-panel" />
      </div>
      <div className="skeleton-block skeleton-pdp-buy" />
    </div>
  );
}

export function SkeletonSuggestions({ count = 4 }: { count?: number }) {
  return (
    <div className="skeleton-suggestions" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div className="skeleton-suggestion" key={i}>
          <div className="skeleton-block skeleton-suggestion-thumb" />
          <div className="skeleton-suggestion-body">
            <div className="skeleton-line skeleton-line--lg" />
            <div className="skeleton-line skeleton-line--sm" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Loading({
  label = 'Loading…',
  variant = 'grid',
}: {
  label?: string;
  variant?: 'grid' | 'pdp' | 'inline' | 'boot' | 'home' | 'category' | 'search';
}) {
  if (variant === 'inline') {
    return (
      <div className="status-inline" role="status">
        <span className="spinner" aria-hidden />
        <span className="muted">{label}</span>
      </div>
    );
  }

  if (variant === 'boot') {
    return (
      <div className="boot-loader" role="status" aria-busy="true">
        <span className="spinner spinner--lg" aria-hidden />
        <p className="boot-loader-label">{label}</p>
      </div>
    );
  }

  if (variant === 'pdp') {
    return (
      <div className="commerce-page page-enter" role="status" aria-busy="true">
        <p className="sr-only">{label}</p>
        <div className="skeleton-line skeleton-line--breadcrumb" />
        <SkeletonPdp />
      </div>
    );
  }

  if (variant === 'home') {
    return (
      <div role="status" aria-busy="true">
        <p className="sr-only">{label}</p>
        <SkeletonShelf titleWidth="28%" count={5} />
        <SkeletonShelf titleWidth="34%" count={8} />
      </div>
    );
  }

  if (variant === 'category') {
    return (
      <div role="status" aria-busy="true">
        <p className="sr-only">{label}</p>
        <SkeletonShelf titleWidth="48%" count={5} />
        <SkeletonShelf titleWidth="36%" count={5} />
      </div>
    );
  }

  if (variant === 'search') {
    return (
      <section className="shelf shelf--loading" role="status" aria-busy="true">
        <p className="sr-only">{label}</p>
        <SkeletonProductGrid count={8} />
      </section>
    );
  }

  return (
    <div className="status-block" role="status" aria-busy="true">
      <div className="status-inline status-inline--block">
        <span className="spinner" aria-hidden />
        <span className="muted">{label}</span>
      </div>
      <SkeletonProductGrid count={5} />
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
