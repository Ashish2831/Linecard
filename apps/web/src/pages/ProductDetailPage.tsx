import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiGet } from '../api/client';
import { EnquiryForm } from '../components/EnquiryForm';
import { ProductAskPanel } from '../components/ProductAskPanel';
import { StarRating } from '../components/StarRating';
import { ErrorText, Loading } from '../components/Status';
import type { Product, User } from '../types';

export function ProductDetailPage({ user }: { user: User | null }) {
  const { id = '' } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const result = await apiGet<Product>(`/api/products/${id}`);
        if (!cancelled) setProduct(result);
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
  }, [id]);

  if (loading) return <Loading label="Loading product…" variant="pdp" />;
  if (error) {
    return (
      <div className="commerce-page page-enter">
        <ErrorText message={error} />
      </div>
    );
  }
  if (!product) {
    return (
      <div className="commerce-page page-enter">
        <ErrorText message="Product not found" />
      </div>
    );
  }

  return (
    <div className="commerce-page page-enter">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to={`/categories/${encodeURIComponent(product.category)}`}>
          {product.category}
        </Link>
        <span>/</span>
        <span className="breadcrumb-current">{product.title}</span>
      </nav>

      <div className="pdp">
        <div className="pdp-media">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="pdp-info">
          <h1>{product.title}</h1>
          <Link
            className="pdp-category-link"
            to={`/categories/${encodeURIComponent(product.category)}`}
          >
            Visit the {product.category} store
          </Link>
          <StarRating rate={product.rating.rate} count={product.rating.count} />
          <hr className="pdp-rule" />
          <p className="pdp-description">{product.description}</p>
          <ProductAskPanel productId={product.id} isAuthenticated={Boolean(user)} />
        </div>

        <aside className="buy-box">
          <div className="buy-box-price">
            <span className="price-currency">$</span>
            <span className="price">{product.price.toFixed(2)}</span>
          </div>
          <p className="buy-box-note">
            Enquire with sales for availability, bulk pricing, and delivery options.
          </p>
          <EnquiryForm productId={product.id} isAuthenticated={Boolean(user)} compact />
        </aside>
      </div>
    </div>
  );
}
