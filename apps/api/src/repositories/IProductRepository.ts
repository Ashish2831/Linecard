import type { PagedResult, Product, ProductQuery } from '../domain/types.js';

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findMany(query?: ProductQuery): Promise<PagedResult<Product>>;
  listCategories(): Promise<string[]>;
}
