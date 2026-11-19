import { NotFoundError, ValidationError } from '../domain/errors.js';
import type { EnquiryInput } from '../domain/types.js';
import { EVENTS, eventBus } from '../events/emitter.js';
import { sanitizeEmail, sanitizeString } from '../lib/sanitize.js';
import type { IProductRepository } from '../repositories/IProductRepository.js';

export class EnquiryService {
  constructor(private readonly repository: IProductRepository) {}

  async submit(input: EnquiryInput): Promise<{ ok: true }> {
    const productId = sanitizeString(input.productId, 64);
    const name = sanitizeString(input.name, 120);
    const email = sanitizeEmail(input.email);
    const message = sanitizeString(input.message, 4000);
    const phone = input.phone ? sanitizeString(input.phone, 40) : undefined;

    if (!productId || !name || !email || !message) {
      throw new ValidationError('Name, email, message and product are required');
    }
    if (!email.includes('@')) {
      throw new ValidationError('Invalid email address');
    }

    const product = await this.repository.findById(productId);
    if (!product) {
      throw new NotFoundError('Product');
    }

    await eventBus.emit(EVENTS.ENQUIRY_SUBMITTED, {
      productId: product.id,
      productTitle: product.title,
      name,
      email,
      message,
      phone,
    });

    return { ok: true };
  }
}
