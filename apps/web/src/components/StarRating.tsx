export function StarRating({
  rate,
  count,
  size = 'md',
}: {
  rate: number;
  count?: number;
  size?: 'sm' | 'md';
}) {
  const full = Math.floor(rate);
  const half = rate - full >= 0.5;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return 'full';
    if (i === full && half) return 'half';
    return 'empty';
  });

  return (
    <span className={`star-rating star-rating--${size}`} aria-label={`${rate} out of 5`}>
      <span className="stars" aria-hidden>
        {stars.map((kind, i) => (
          <span key={i} className={`star star--${kind}`}>
            ★
          </span>
        ))}
      </span>
      <span className="star-rate">{rate.toFixed(1)}</span>
      {typeof count === 'number' && (
        <span className="star-count">({count.toLocaleString()})</span>
      )}
    </span>
  );
}
