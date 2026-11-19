import { beforeEach, describe, expect, it, vi } from 'vitest';

const redisState = vi.hoisted(() => ({
  store: new Map<string, string>(),
}));

vi.mock('../lib/redis.js', () => ({
  redisGet: vi.fn(async (key: string) => redisState.store.get(key) ?? null),
  redisSet: vi.fn(async (key: string, value: string) => {
    redisState.store.set(key, value);
  }),
}));

import type { IProductAssistant } from '../assistant/IProductAssistant.js';
import type { Product } from '../domain/types.js';
import type { IProductRepository } from '../repositories/IProductRepository.js';
import { CatalogueRagIndexer } from '../rag/CatalogueRagIndexer.js';
import { StubEmbeddingProvider } from '../rag/StubEmbeddingProvider.js';
import { CatalogueRagService } from './CatalogueRagService.js';

const products: Product[] = [
  {
    id: '1',
    title: 'Gold Ring',
    price: 100,
    description: 'Elegant gold jewellery ring',
    category: 'jewelery',
    image: 'x',
    rating: { rate: 4, count: 2 },
  },
  {
    id: '2',
    title: 'USB Hub',
    price: 20,
    description: 'Electronics multiport usb hub',
    category: 'electronics',
    image: 'x',
    rating: { rate: 4, count: 2 },
  },
];

describe('CatalogueRagService', () => {
  beforeEach(() => {
    redisState.store.clear();
  });

  it('returns grounded answer with citations using a single catalogue fetch', async () => {
    const findMany = vi.fn(async () => ({
      data: products,
      total: 2,
      page: 1,
      pageSize: 100,
    }));
    const repo: IProductRepository = {
      findById: vi.fn(),
      findMany,
      listCategories: vi.fn(),
    };
    const assistant: IProductAssistant = {
      ask: vi.fn(async () => ({
        provider: 'openai' as const,
        answer: 'stub answer about jewellery',
      })),
    };
    const embeddings = new StubEmbeddingProvider();
    const indexer = new CatalogueRagIndexer(embeddings, 60);
    const service = new CatalogueRagService(repo, embeddings, indexer, assistant, 2);

    const result = await service.ask('gold jewellery ring');

    expect(findMany).toHaveBeenCalledTimes(1);
    expect(result.answer).toContain('stub answer');
    expect(result.citations.length).toBeGreaterThan(0);
    expect(result.citations.some((c) => c.productId === '1')).toBe(true);
  });
});
