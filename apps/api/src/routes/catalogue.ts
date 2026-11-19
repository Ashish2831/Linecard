import { Router } from 'express';
import { z } from 'zod';
import { ValidationError } from '../domain/errors.js';
import { csrfProtection } from '../middleware/csrf.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { ok, fail } from '../lib/responses.js';
import type { CatalogueRagService } from '../services/CatalogueRagService.js';

const askSchema = z.object({
  question: z.string().min(1).max(500),
});

export function createCatalogueRouter(ragService: CatalogueRagService) {
  const router = Router();

  router.post(
    '/ask',
    requireAuth,
    csrfProtection,
    rateLimit({ name: 'rag', limit: 20, windowMs: 60_000 }),
    async (req, res) => {
      try {
        const parsed = askSchema.safeParse(req.body);
        if (!parsed.success) {
          throw new ValidationError('Question is required');
        }
        ok(res, await ragService.ask(parsed.data.question));
      } catch (error) {
        fail(res, error);
      }
    },
  );

  return router;
}
