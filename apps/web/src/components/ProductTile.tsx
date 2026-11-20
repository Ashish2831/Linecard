import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { StarRating } from './StarRating';

export function ProductTile({ product }: { product: Product }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link className="product-tile" to={`/products/${product.id}`}>
      <div className={`media${imageLoaded ? ' is-ready' : ' is-loading'}`}>
        {!imageLoaded && <div className="skeleton-block media-skeleton" aria-hidden />}
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      <div className="body">
        <h3>{product.title}</h3>
        <StarRating rate={product.rating.rate} count={product.rating.count} size="sm" />
        <div className="price-row">
          <span className="price-currency">$</span>
          <span className="price">{product.price.toFixed(2)}</span>
        </div>
        <span className="tile-category">{product.category}</span>
      </div>
    </Link>
  );
}
