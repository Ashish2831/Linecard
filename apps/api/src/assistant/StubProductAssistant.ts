import type { AssistantAnswer } from '../domain/types.js';
import type { AskContext, IProductAssistant } from './IProductAssistant.js';

export class StubProductAssistant implements IProductAssistant {
  async ask(context: AskContext): Promise<AssistantAnswer> {
    if (context.catalogueContext?.length) {
      const lines = context.catalogueContext.map(
        (p) => `- ${p.title} (${p.category}, $${p.price.toFixed(2)}): ${p.description.slice(0, 120)}…`,
      );
      return {
        provider: 'stub',
        answer: `Based on the Linecard catalogue matches for “${context.question}”:\n${lines.join('\n')}\n\n(Stub assistant — set AI_PROVIDER=openai for live model answers.)`,
      };
    }

    const product = context.product;
    if (!product) {
      return {
        provider: 'stub',
        answer: 'No product context available.',
      };
    }

    return {
      provider: 'stub',
      answer: `“${product.title}” is in ${product.category} at $${product.price.toFixed(2)} (rated ${product.rating.rate}/5 from ${product.rating.count} reviews). ${product.description.slice(0, 280)}${product.description.length > 280 ? '…' : ''}\n\nRegarding “${context.question}”: this stub answer uses only catalogue fields. Enable OpenAI for richer responses.`,
    };
  }
}
