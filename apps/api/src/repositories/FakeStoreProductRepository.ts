import { UpstreamError } from '../domain/errors.js';
import type { PagedResult, Product, ProductQuery } from '../domain/types.js';
import { applyProductQuery } from '../lib/productSort.js';
import { redisGet, redisSet } from '../lib/redis.js';
import type { IProductRepository } from './IProductRepository.js';

interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

const SNAPSHOT_KEY = 'products:all';
const DEFAULT_FETCH_TIMEOUT_MS = 8_000;

/**
 * Fake Store adapter with a shared catalogue snapshot.
 * Upstream is fetched at most once per TTL (single-flight); queries run in memory.
 * Swap this class for a DB-backed repository when the catalogue outgrows Fake Store.
 */
export class FakeStoreProductRepository implements IProductRepository {
  private snapshot: Product[] | null = null;
  private snapshotById = new Map<string, Product>();
  private snapshotExpiresAt = 0;
  private refreshPromise: Promise<Product[]> | null = null;

  constructor(
    private readonly baseUrl: string,
    private readonly ttlSeconds = 300,
    private readonly fetchTimeoutMs = DEFAULT_FETCH_TIMEOUT_MS,
  ) {}

  private map(raw: FakeStoreProduct): Product {
    return {
      id: String(raw.id),
      title: raw.title,
      price: raw.price,
      description: raw.description,
      category: raw.category,
      image: raw.image,
      rating: {
        rate: raw.rating?.rate ?? 0,
        count: raw.rating?.count ?? 0,
      },
    };
  }

  private async fetchJson<T>(path: string): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.fetchTimeoutMs);
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, { signal: controller.signal });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new UpstreamError('Product source timed out');
      }
      throw new UpstreamError('Unable to reach product source');
    } finally {
      clearTimeout(timer);
    }
    if (!response.ok) {
      throw new UpstreamError(`Product source returned ${response.status}`);
    }
    return (await response.json()) as T;
  }

  private remember(products: Product[]): Product[] {
    this.snapshot = products;
    this.snapshotById = new Map(products.map((p) => [p.id, p]));
    this.snapshotExpiresAt = Date.now() + this.ttlSeconds * 1000;
    return products;
  }

  private async fetchCatalogueFromUpstream(): Promise<Product[]> {
    const raw = await this.fetchJson<FakeStoreProduct[]>('/products');
    return raw.map((item) => this.map(item));
  }

  private async refreshCatalogue(): Promise<Product[]> {
    const cached = await redisGet(SNAPSHOT_KEY);
    if (cached) {
      try {
        return this.remember(JSON.parse(cached) as Product[]);
      } catch {
        /* corrupt cache — fall through to upstream */
      }
    }

    const products = await this.fetchCatalogueFromUpstream();
    this.remember(products);
    await redisSet(SNAPSHOT_KEY, JSON.stringify(products), this.ttlSeconds);
    return products;
  }

  /** Hot path: memory → Redis snapshot → single upstream refresh. */
  private async getCatalogue(): Promise<Product[]> {
    if (this.snapshot && Date.now() < this.snapshotExpiresAt) {
      return this.snapshot;
    }
    if (this.refreshPromise) {
      return this.refreshPromise;
    }
    this.refreshPromise = this.refreshCatalogue().finally(() => {
      this.refreshPromise = null;
    });
    return this.refreshPromise;
  }

  async findById(id: string): Promise<Product | null> {
    await this.getCatalogue();
    return this.snapshotById.get(id) ?? null;
  }

  async findMany(query: ProductQuery = {}): Promise<PagedResult<Product>> {
    const catalogue = await this.getCatalogue();
    return applyProductQuery(catalogue, query);
  }

  async listCategories(): Promise<string[]> {
    const catalogue = await this.getCatalogue();
    return [...new Set(catalogue.map((p) => p.category))].sort((a, b) =>
      a.localeCompare(b),
    );
  }
}
