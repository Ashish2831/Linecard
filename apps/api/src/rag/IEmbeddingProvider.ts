export interface IEmbeddingProvider {
  readonly provider: 'stub' | 'openai';
  embed(texts: string[]): Promise<number[][]>;
}
