import { UpstreamError } from '../domain/errors.js';
import type { IEmbeddingProvider } from './IEmbeddingProvider.js';

export class OpenAIEmbeddingProvider implements IEmbeddingProvider {
  readonly provider = 'openai' as const;

  constructor(private readonly apiKey: string) {}

  async embed(texts: string[]): Promise<number[][]> {
    if (!this.apiKey) {
      throw new UpstreamError('OPENAI_API_KEY is not configured');
    }

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: texts,
      }),
    });

    if (!response.ok) {
      throw new UpstreamError('OpenAI embeddings request failed');
    }

    const body = (await response.json()) as {
      data: Array<{ embedding: number[]; index: number }>;
    };

    return body.data
      .sort((a, b) => a.index - b.index)
      .map((d) => d.embedding);
  }
}
