import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiGet } from '../api/client';
import { ProductTile } from '../components/ProductTile';
import { Empty, ErrorText, Loading } from '../components/Status';
import type { PagedResult, Product } from '../types';

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await apiGet<PagedResult<Product>>(
          `/api/products?q=${encodeURIComponent(q)}&pageSize=50`,
        );
        if (!cancelled) {
          setProducts(result.data);
          setTotal(result.total);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (q) void load();
    else {
      setProducts([]);
      setTotal(0);
      setLoading(false);
    }
    return () => {
      cancelled = true;
    };
  }, [q]);

  return (
    <div className="commerce-page page-enter">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden>/</span>
        <span className="breadcrumb-current">Search</span>
      </nav>

      <header className="shelf-head shelf-head--page">
        <h1>{q ? `Results for “${q}”` : 'Search'}</h1>
        {q && !loading && !error && (
          <p className="muted">
            {total} result{total === 1 ? '' : 's'}
          </p>
        )}
      </header>

      {loading && <Loading label="Searching…" />}
      {error && <ErrorText message={error} />}
      {!loading && !error && products.length === 0 && (
        <Empty label="No products match that search. Try another term." />
      )}
      {!loading && !error && products.length > 0 && (
        <section className="shelf">
          <div className="product-grid product-grid--reveal">
            {products.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
