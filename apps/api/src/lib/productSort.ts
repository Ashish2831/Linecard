import type { PagedResult, Product, ProductQuery } from '../domain/types.js';

/** Single rating sort used by featured + category to avoid inconsistencies. */
export function sortByRatingDesc(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    if (b.rating.rate !== a.rating.rate) {
      return b.rating.rate - a.rating.rate;
    }
    return b.rating.count - a.rating.count;
  });
}

export function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 20,
): PagedResult<T> {
  const safePage = Math.max(1, page);
  const safeSize = Math.min(100, Math.max(1, pageSize));
  const start = (safePage - 1) * safeSize;
  return {
    data: items.slice(start, start + safeSize),
    total: items.length,
    page: safePage,
    pageSize: safeSize,
  };
}

/** Filter / sort / page against an in-memory catalogue snapshot. */
export function applyProductQuery(
  catalogue: Product[],
  query: ProductQuery = {},
): PagedResult<Product> {
  let products = catalogue;

  if (query.category) {
    const category = query.category.toLowerCase();
    products = products.filter((p) => p.category.toLowerCase() === category);
  }

  if (query.q?.trim()) {
    const term = query.q.trim().toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term),
    );
  }

  if (query.sort === 'title') {
    products = [...products].sort((a, b) => a.title.localeCompare(b.title));
  } else {
    products = sortByRatingDesc(products);
  }

  return paginate(products, query.page ?? 1, query.pageSize ?? 20);
}
