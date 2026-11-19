import { NotFoundError } from '../domain/errors.js';
import type { PagedResult, Product, ProductQuery } from '../domain/types.js';
import { sortByRatingDesc } from '../lib/productSort.js';
import type { IProductRepository } from '../repositories/IProductRepository.js';

export interface CategoryProducts {
  category: string;
  topRated: Product[];
  additional: Product[];
}

export class ProductService {
  constructor(private readonly repository: IProductRepository) {}

  async getFeatured(limit = 5): Promise<Product[]> {
    const page = await this.repository.findMany({
      sort: 'rating',
      page: 1,
      pageSize: 100,
    });
    return sortByRatingDesc(page.data).slice(0, limit);
  }

  async getById(id: string): Promise<Product> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundError('Product');
    }
    return product;
  }

  async list(query: ProductQuery): Promise<PagedResult<Product>> {
    return this.repository.findMany(query);
  }

  async listCategories(): Promise<string[]> {
    return this.repository.listCategories();
  }

  async getCategoryProducts(category: string): Promise<CategoryProducts> {
    const page = await this.repository.findMany({
      category,
      sort: 'rating',
      page: 1,
      pageSize: 100,
    });
    const ordered = sortByRatingDesc(page.data);
    const topRated = ordered.slice(0, 5);
    const topIds = new Set(topRated.map((p) => p.id));
    const additional = ordered.filter((p) => !topIds.has(p.id));
    return { category, topRated, additional };
  }
}
