import type { IEmbeddingProvider } from './IEmbeddingProvider.js';

const DIM = 64;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function hashToken(token: string): number {
  let h = 0;
  for (let i = 0; i < token.length; i += 1) {
    h = (h * 31 + token.charCodeAt(i)) >>> 0;
  }
  return h % DIM;
}

export class StubEmbeddingProvider implements IEmbeddingProvider {
  readonly provider = 'stub' as const;

  async embed(texts: string[]): Promise<number[][]> {
    return texts.map((text) => {
      const vec = new Array<number>(DIM).fill(0);
      for (const token of tokenize(text)) {
        vec[hashToken(token)] += 1;
      }
      const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
      return vec.map((v) => v / norm);
    });
  }
}
