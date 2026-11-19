import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiGet } from '../api/client';
import { ProductTile } from '../components/ProductTile';
import { Empty, ErrorText, Loading } from '../components/Status';
import type { CategoryProducts } from '../types';

export function CategoryPage() {
  const { category = '' } = useParams();
  const decoded = decodeURIComponent(category);
  const [data, setData] = useState<CategoryProducts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await apiGet<CategoryProducts>(
          `/api/categories/${encodeURIComponent(category)}`,
        );
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [category]);

  return (
    <div className="commerce-page page-enter">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden>/</span>
        <span className="breadcrumb-current">{decoded}</span>
      </nav>

      <header className="shelf-head shelf-head--page">
        <h1 className="display-title">{decoded}</h1>
        <p className="muted">Shop top-rated picks and more from this department</p>
      </header>

      {loading && <Loading label="Loading category…" />}
      {error && <ErrorText message={error} />}
      {data && (
        <>
          <section className="shelf">
            <div className="shelf-head">
              <h2>Top rated in {decoded}</h2>
            </div>
            {data.topRated.length === 0 ? (
              <Empty label="No products in this category." />
            ) : (
              <div className="product-grid product-grid--reveal">
                {data.topRated.map((p) => (
                  <ProductTile key={p.id} product={p} />
                ))}
              </div>
            )}
          </section>

          <section className="shelf">
            <div className="shelf-head">
              <h2>More in {decoded}</h2>
            </div>
            {data.additional.length === 0 ? (
              <Empty label="No additional products." />
            ) : (
              <div className="product-grid product-grid--reveal">
                {data.additional.map((p) => (
                  <ProductTile key={p.id} product={p} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
