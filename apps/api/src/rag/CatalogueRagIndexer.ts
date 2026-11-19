import type { Product } from '../domain/types.js';
import { redisGet, redisSet } from '../lib/redis.js';
import type { IEmbeddingProvider } from './IEmbeddingProvider.js';

export interface RagChunk {
  productId: string;
  title: string;
  category: string;
  price: number;
  description: string;
  text: string;
  vector: number[];
}

interface StoredIndex {
  chunks: RagChunk[];
}

function chunkText(product: Product): string {
  return `${product.title}\n${product.category}\n$${product.price}\n${product.description}`;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < len; i += 1) {
    dot += a[i]! * b[i]!;
    na += a[i]! * a[i]!;
    nb += b[i]! * b[i]!;
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

export class CatalogueRagIndexer {
  constructor(
    private readonly embeddings: IEmbeddingProvider,
    private readonly ttlSeconds: number,
    private readonly key = 'rag:index:v1',
  ) {}

  async getOrBuild(products: Product[]): Promise<RagChunk[]> {
    const cached = await redisGet(this.key);
    if (cached) {
      return (JSON.parse(cached) as StoredIndex).chunks;
    }

    const texts = products.map((p) => chunkText(p));
    const vectors = await this.embeddings.embed(texts);
    const chunks: RagChunk[] = products.map((product, i) => ({
      productId: product.id,
      title: product.title,
      category: product.category,
      price: product.price,
      description: product.description,
      text: texts[i]!,
      vector: vectors[i]!,
    }));

    await redisSet(this.key, JSON.stringify({ chunks } satisfies StoredIndex), this.ttlSeconds);
    return chunks;
  }
}
