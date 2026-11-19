import type { PagedResult, Product, ProductQuery } from '../domain/types.js';
import { redisGet, redisSet } from '../lib/redis.js';
import type { IProductRepository } from './IProductRepository.js';

/**
 * L1 response cache over the product repository.
 * The Fake Store adapter already keeps a shared `products:all` snapshot;
 * this decorator caches hot query/id responses to skip re-filtering.
 */
export class RedisCachingProductRepository implements IProductRepository {
  constructor(
    private readonly inner: IProductRepository,
    private readonly ttlSeconds: number,
  ) {}

  async findById(id: string): Promise<Product | null> {
    const key = `products:id:${id}`;
    const cached = await redisGet(key);
    if (cached) {
      return cached === 'null' ? null : (JSON.parse(cached) as Product);
    }
    const product = await this.inner.findById(id);
    await redisSet(key, product ? JSON.stringify(product) : 'null', this.ttlSeconds);
    return product;
  }

  async findMany(query: ProductQuery = {}): Promise<PagedResult<Product>> {
    const key = `products:query:${stableQueryKey(query)}`;
    const cached = await redisGet(key);
    if (cached) {
      return JSON.parse(cached) as PagedResult<Product>;
    }
    const result = await this.inner.findMany(query);
    await redisSet(key, JSON.stringify(result), this.ttlSeconds);
    return result;
  }

  async listCategories(): Promise<string[]> {
    const key = 'products:categories';
    const cached = await redisGet(key);
    if (cached) {
      return JSON.parse(cached) as string[];
    }
    const categories = await this.inner.listCategories();
    await redisSet(key, JSON.stringify(categories), this.ttlSeconds);
    return categories;
  }
}

function stableQueryKey(query: ProductQuery): string {
  return JSON.stringify({
    category: query.category ?? null,
    q: query.q ?? null,
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 20,
    sort: query.sort ?? 'rating',
  });
}
