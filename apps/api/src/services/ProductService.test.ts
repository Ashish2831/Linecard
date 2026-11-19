import { describe, expect, it } from 'vitest';
import type { IProductRepository } from '../repositories/IProductRepository.js';
import type { Product } from '../domain/types.js';
import { ProductService } from './ProductService.js';

function product(
  id: string,
  rate: number,
  count: number,
  category = 'electronics',
): Product {
  return {
    id,
    title: `Product ${id}`,
    price: 10,
    description: `Description ${id}`,
    category,
    image: 'https://example.com/p.png',
    rating: { rate, count },
  };
}

function mockRepo(products: Product[]): IProductRepository {
  return {
    async findById(id) {
      return products.find((p) => p.id === id) ?? null;
    },
    async findMany(query = {}) {
      let data = [...products];
      if (query.category) {
        data = data.filter((p) => p.category === query.category);
      }
      if (query.q) {
        const q = query.q.toLowerCase();
        data = data.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q),
        );
      }
      return { data, total: data.length, page: 1, pageSize: data.length };
    },
    async listCategories() {
      return [...new Set(products.map((p) => p.category))];
    },
  };
}

describe('ProductService', () => {
  const products = [
    product('1', 4.9, 100),
    product('2', 4.8, 50),
    product('3', 4.7, 10),
    product('4', 4.6, 5),
    product('5', 4.5, 5),
    product('6', 4.4, 5),
    product('7', 3.0, 1, 'jewelery'),
  ];

  it('returns exactly 5 featured products ordered by rating', async () => {
    const service = new ProductService(mockRepo(products));
    const featured = await service.getFeatured(5);
    expect(featured).toHaveLength(5);
    expect(featured.map((p) => p.id)).toEqual(['1', '2', '3', '4', '5']);
  });

  it('splits category into topRated and additional without overlap', async () => {
    const service = new ProductService(mockRepo(products));
    const result = await service.getCategoryProducts('electronics');
    const topIds = result.topRated.map((p) => p.id);
    const addIds = result.additional.map((p) => p.id);
    expect(topIds).toHaveLength(5);
    expect(new Set([...topIds, ...addIds]).size).toBe(topIds.length + addIds.length);
    expect(addIds).toContain('6');
  });

  it('searches case-insensitively on title and description', async () => {
    const service = new ProductService(mockRepo(products));
    const result = await service.list({ q: 'PRODUCT 7' });
    expect(result.data.map((p) => p.id)).toEqual(['7']);
  });
});
