import type { IProductAssistant } from '../assistant/IProductAssistant.js';
import { NotFoundError, ValidationError } from '../domain/errors.js';
import type { AssistantAnswer } from '../domain/types.js';
import { sanitizeString } from '../lib/sanitize.js';
import type { IProductRepository } from '../repositories/IProductRepository.js';

export class ProductAssistantService {
  constructor(
    private readonly repository: IProductRepository,
    private readonly assistant: IProductAssistant,
  ) {}

  async ask(productId: string, questionRaw: string): Promise<AssistantAnswer> {
    const question = sanitizeString(questionRaw, 500);
    if (!question) {
      throw new ValidationError('Question is required');
    }

    const product = await this.repository.findById(productId);
    if (!product) {
      throw new NotFoundError('Product');
    }

    return this.assistant.ask({ product, question });
  }
}
