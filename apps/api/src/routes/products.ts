import { Router } from 'express';
import { z } from 'zod';
import { ValidationError } from '../domain/errors.js';
import { csrfProtection } from '../middleware/csrf.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { ok, fail } from '../lib/responses.js';
import type { ProductAssistantService } from '../services/ProductAssistantService.js';
import type { ProductService } from '../services/ProductService.js';

const listSchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
});

const askSchema = z.object({
  question: z.string().min(1).max(500),
});

export function createProductsRouter(
  productService: ProductService,
  assistantService: ProductAssistantService,
) {
  const router = Router();

  router.get('/featured', async (_req, res) => {
    try {
      ok(res, await productService.getFeatured(5));
    } catch (error) {
      fail(res, error);
    }
  });

  router.get('/', async (req, res) => {
    try {
      const parsed = listSchema.safeParse(req.query);
      if (!parsed.success) {
        throw new ValidationError('Invalid query parameters');
      }
      ok(res, await productService.list(parsed.data));
    } catch (error) {
      fail(res, error);
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      ok(res, await productService.getById(req.params.id));
    } catch (error) {
      fail(res, error);
    }
  });

  router.post(
    '/:id/ask',
    requireAuth,
    csrfProtection,
    rateLimit({ name: 'ask', limit: 30, windowMs: 60_000 }),
    async (req, res) => {
      try {
        const parsed = askSchema.safeParse(req.body);
        if (!parsed.success) {
          throw new ValidationError('Question is required');
        }
        ok(res, await assistantService.ask(req.params.id, parsed.data.question));
      } catch (error) {
        fail(res, error);
      }
    },
  );

  return router;
}
