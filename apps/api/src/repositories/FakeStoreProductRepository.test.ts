import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const redisState = vi.hoisted(() => ({
  store: new Map<string, string>(),
}));

vi.mock('../lib/redis.js', () => ({
  redisGet: vi.fn(async (key: string) => redisState.store.get(key) ?? null),
  redisSet: vi.fn(async (key: string, value: string) => {
    redisState.store.set(key, value);
  }),
  redisDel: vi.fn(async (key: string) => {
    redisState.store.delete(key);
  }),
}));

import { FakeStoreProductRepository } from './FakeStoreProductRepository.js';

const sample = [
  {
    id: 1,
    title: 'Alpha Drive',
    price: 10,
    description: 'storage for gaming',
    category: 'electronics',
    image: 'a.png',
    rating: { rate: 4.8, count: 100 },
  },
  {
    id: 2,
    title: 'Beta Jacket',
    price: 20,
    description: 'cotton jacket',
    category: "men's clothing",
    image: 'b.png',
    rating: { rate: 4.2, count: 50 },
  },
];

describe('FakeStoreProductRepository', () => {
  beforeEach(() => {
    redisState.store.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('fetches the catalogue once and serves findMany from the snapshot', async () => {
    const fetchMock = vi.fn(
      async (_url: string | URL, _init?: RequestInit) =>
        ({
          ok: true,
          json: async () => sample,
        }) as Response,
    );
    vi.stubGlobal('fetch', fetchMock);

    const repo = new FakeStoreProductRepository('https://example.test', 60);

    const first = await repo.findMany({ pageSize: 10 });
    const second = await repo.findMany({ q: 'gaming' });
    const byId = await repo.findById('1');
    const categories = await repo.listCategories();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.test/products',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(first.total).toBe(2);
    expect(second.data).toHaveLength(1);
    expect(second.data[0]?.id).toBe('1');
    expect(byId?.title).toBe('Alpha Drive');
    expect(categories).toEqual(['electronics', "men's clothing"]);
  });

  it('coalesces concurrent refresh into a single upstream call', async () => {
    let resolveFetch!: (value: unknown) => void;
    const fetchMock = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const repo = new FakeStoreProductRepository('https://example.test', 60);
    const pending = Promise.all([
      repo.findMany({}),
      repo.findById('2'),
      repo.listCategories(),
    ]);

    // Allow the shared refresh promise to start.
    await Promise.resolve();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    resolveFetch({
      ok: true,
      json: async () => sample,
    });

    const [page, product, categories] = await pending;
    expect(page.total).toBe(2);
    expect(product?.id).toBe('2');
    expect(categories).toHaveLength(2);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('reuses a Redis snapshot without calling upstream', async () => {
    redisState.store.set(
      'products:all',
      JSON.stringify(
        sample.map((item) => ({
          id: String(item.id),
          title: item.title,
          price: item.price,
          description: item.description,
          category: item.category,
          image: item.image,
          rating: item.rating,
        })),
      ),
    );
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const repo = new FakeStoreProductRepository('https://example.test', 60);
    const page = await repo.findMany({});

    expect(fetchMock).not.toHaveBeenCalled();
    expect(page.total).toBe(2);
  });
});
