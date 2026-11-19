import type { IProductAssistant } from '../assistant/IProductAssistant.js';
import { ValidationError } from '../domain/errors.js';
import type { RagAnswer } from '../domain/types.js';
import { sanitizeString } from '../lib/sanitize.js';
import {
  CatalogueRagIndexer,
  cosineSimilarity,
} from '../rag/CatalogueRagIndexer.js';
import type { IEmbeddingProvider } from '../rag/IEmbeddingProvider.js';
import type { IProductRepository } from '../repositories/IProductRepository.js';

export class CatalogueRagService {
  constructor(
    private readonly repository: IProductRepository,
    private readonly embeddings: IEmbeddingProvider,
    private readonly indexer: CatalogueRagIndexer,
    private readonly assistant: IProductAssistant,
    private readonly topK = 5,
  ) {}

  async ask(questionRaw: string): Promise<RagAnswer> {
    const question = sanitizeString(questionRaw, 500);
    if (!question) {
      throw new ValidationError('Question is required');
    }

    // One bounded catalogue fetch — no per-product N+1
    const page = await this.repository.findMany({ page: 1, pageSize: 100 });
    const chunks = await this.indexer.getOrBuild(page.data);
    const [queryVector] = await this.embeddings.embed([question]);

    const ranked = chunks
      .map((chunk) => ({
        chunk,
        score: cosineSimilarity(queryVector!, chunk.vector),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, this.topK);

    const catalogueContext = ranked.map(({ chunk }) => ({
      id: chunk.productId,
      title: chunk.title,
      description: chunk.description,
      category: chunk.category,
      price: chunk.price,
    }));

    const answer = await this.assistant.ask({ question, catalogueContext });

    return {
      ...answer,
      citations: ranked.map(({ chunk }) => ({
        productId: chunk.productId,
        title: chunk.title,
      })),
    };
  }
}
