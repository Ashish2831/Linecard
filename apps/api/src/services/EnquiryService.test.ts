import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { IProductRepository } from '../repositories/IProductRepository.js';
import type { Product } from '../domain/types.js';
import { eventBus, EVENTS } from '../events/emitter.js';
import { EnquiryService } from './EnquiryService.js';

const sample: Product = {
  id: '1',
  title: 'Widget',
  price: 9,
  description: 'A widget',
  category: 'electronics',
  image: 'x',
  rating: { rate: 4, count: 1 },
};

describe('EnquiryService', () => {
  let repo: IProductRepository;

  beforeEach(() => {
    repo = {
      findById: vi.fn(async (id) => (id === '1' ? sample : null)),
      findMany: vi.fn(),
      listCategories: vi.fn(),
    };
  });

  it('rejects invalid payload without emitting', async () => {
    const emit = vi.spyOn(eventBus, 'emit');
    const service = new EnquiryService(repo);
    await expect(
      service.submit({
        productId: '',
        name: '',
        email: 'bad',
        message: '',
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION_ERROR' });
    expect(emit).not.toHaveBeenCalled();
  });

  it('rejects unknown product without emitting', async () => {
    const emit = vi.spyOn(eventBus, 'emit');
    const service = new EnquiryService(repo);
    await expect(
      service.submit({
        productId: '999',
        name: 'Ada',
        email: 'ada@example.com',
        message: 'Interested',
      }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
    expect(emit).not.toHaveBeenCalled();
  });

  it('emits enquiry.submitted once on success', async () => {
    const emit = vi.spyOn(eventBus, 'emit').mockResolvedValue(undefined);
    const service = new EnquiryService(repo);
    await service.submit({
      productId: '1',
      name: 'Ada',
      email: 'ada@example.com',
      message: 'Interested',
    });
    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit.mock.calls[0]?.[0]).toBe(EVENTS.ENQUIRY_SUBMITTED);
  });
});
