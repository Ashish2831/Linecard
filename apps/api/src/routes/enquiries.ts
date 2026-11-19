import { Router } from 'express';
import { z } from 'zod';
import { ValidationError } from '../domain/errors.js';
import { csrfProtection } from '../middleware/csrf.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { ok, fail } from '../lib/responses.js';
import type { EnquiryService } from '../services/EnquiryService.js';

const enquirySchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1).max(120),
  email: z.string().email().max(320),
  message: z.string().min(1).max(4000),
  phone: z.string().max(40).optional(),
});

export function createEnquiriesRouter(enquiryService: EnquiryService) {
  const router = Router();

  router.post(
    '/',
    requireAuth,
    csrfProtection,
    rateLimit({ name: 'enquiry', limit: 10, windowMs: 60_000 }),
    async (req, res) => {
      try {
        const parsed = enquirySchema.safeParse(req.body);
        if (!parsed.success) {
          throw new ValidationError('Invalid enquiry payload');
        }
        const result = await enquiryService.submit(parsed.data);
        ok(res, result, 201);
      } catch (error) {
        fail(res, error);
      }
    },
  );

  return router;
}
