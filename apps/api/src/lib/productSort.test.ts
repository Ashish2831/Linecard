import { describe, expect, it } from 'vitest';
import type { Product } from '../domain/types.js';
import { applyProductQuery, sortByRatingDesc } from './productSort.js';

const products: Product[] = [
  {
    id: '1',
    title: 'High',
    price: 1,
    description: 'gaming ssd',
    category: 'electronics',
    image: '',
    rating: { rate: 5, count: 10 },
  },
  {
    id: '2',
    title: 'Mid',
    price: 2,
    description: 'jacket',
    category: "men's clothing",
    image: '',
    rating: { rate: 4, count: 100 },
  },
  {
    id: '3',
    title: 'Also high',
    price: 3,
    description: 'cable',
    category: 'electronics',
    image: '',
    rating: { rate: 5, count: 2 },
  },
];

describe('productSort', () => {
  it('sorts by rate then count', () => {
    expect(sortByRatingDesc(products).map((p) => p.id)).toEqual(['1', '3', '2']);
  });

  it('filters, sorts, and paginates a snapshot', () => {
    const page = applyProductQuery(products, {
      category: 'electronics',
      page: 1,
      pageSize: 1,
    });
    expect(page.total).toBe(2);
    expect(page.data).toHaveLength(1);
    expect(page.data[0]?.id).toBe('1');
  });

  it('matches search against title and description', () => {
    const page = applyProductQuery(products, { q: 'GAMING' });
    expect(page.data.map((p) => p.id)).toEqual(['1']);
  });
});
