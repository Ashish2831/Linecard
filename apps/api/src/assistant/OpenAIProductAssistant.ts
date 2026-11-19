import { UpstreamError } from '../domain/errors.js';
import type { AssistantAnswer } from '../domain/types.js';
import type { AskContext, IProductAssistant } from './IProductAssistant.js';

export class OpenAIProductAssistant implements IProductAssistant {
  constructor(
    private readonly apiKey: string,
    private readonly model: string,
  ) {}

  async ask(context: AskContext): Promise<AssistantAnswer> {
    if (!this.apiKey) {
      throw new UpstreamError('OPENAI_API_KEY is not configured');
    }

    const system =
      'You are Linecard product assistant. Answer only from the provided product context. If unsure, say so. Be concise.';

    let userContent = `Question: ${context.question}\n\n`;
    if (context.product) {
      userContent += `Product JSON:\n${JSON.stringify(context.product)}`;
    }
    if (context.catalogueContext?.length) {
      userContent += `Catalogue excerpts:\n${JSON.stringify(context.catalogueContext)}`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userContent },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new UpstreamError('OpenAI request failed');
    }

    const body = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const answer = body.choices?.[0]?.message?.content?.trim();
    if (!answer) {
      throw new UpstreamError('OpenAI returned an empty answer');
    }

    return { provider: 'openai', answer };
  }
}
