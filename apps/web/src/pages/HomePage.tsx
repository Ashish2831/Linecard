import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../api/client';
import { ProductTile } from '../components/ProductTile';
import { Empty, ErrorText, Loading } from '../components/Status';
import type { PagedResult, Product } from '../types';

export function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [topRated, catalogue] = await Promise.all([
          apiGet<Product[]>('/api/products/featured'),
          apiGet<PagedResult<Product>>('/api/products?pageSize=100'),
        ]);
        if (cancelled) return;
        const featuredIds = new Set(topRated.map((p) => p.id));
        setFeatured(topRated);
        setAllProducts(catalogue.data.filter((p) => !featuredIds.has(p.id)));
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="commerce-page page-enter">
      <section className="promo-banner">
        <div className="promo-banner-inner">
          <p className="promo-kicker">Linecard catalogue</p>
          <h1>Top-rated products, ready to enquire</h1>
          <p className="promo-copy">
            Search the full line, compare ratings, and send a sales enquiry in minutes.
          </p>
          <div className="promo-actions">
            <a className="btn btn-accent" href="#top-rated">
              Shop top rated
            </a>
            <Link className="btn btn-ghost" to="/catalogue-ask">
              Ask the catalogue
            </Link>
          </div>
        </div>
      </section>

      {loading && <Loading label="Loading catalogue…" />}
      {error && <ErrorText message={error} />}

      {!loading && !error && (
        <>
          <section className="shelf" id="top-rated">
            <div className="shelf-head">
              <h2>Top rated</h2>
              <p className="muted">Hand-picked from the highest customer ratings</p>
            </div>
            {featured.length === 0 ? (
              <Empty label="No featured products yet." />
            ) : (
              <div className="product-grid product-grid--reveal">
                {featured.map((product) => (
                  <ProductTile key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>

          <section className="shelf" id="all-products">
            <div className="shelf-head">
              <h2>All products</h2>
              <p className="muted">Browse the rest of the Linecard catalogue</p>
            </div>
            {allProducts.length === 0 ? (
              <Empty label="No additional products right now." />
            ) : (
              <div className="product-grid product-grid--reveal">
                {allProducts.map((product) => (
                  <ProductTile key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
