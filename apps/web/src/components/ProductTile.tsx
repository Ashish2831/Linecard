import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { StarRating } from './StarRating';

export function ProductTile({ product }: { product: Product }) {
  return (
    <Link className="product-tile" to={`/products/${product.id}`}>
      <div className="media">
        <img src={product.image} alt={product.title} loading="lazy" />
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
