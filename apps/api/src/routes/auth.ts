import { Router } from 'express';
import { z } from 'zod';
import { UnauthorizedError, ValidationError } from '../domain/errors.js';
import { csrfProtection, ensureCsrfToken } from '../middleware/csrf.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { ok, fail } from '../lib/responses.js';
import type { AuthService } from '../services/AuthService.js';

const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export function createAuthRouter(authService: AuthService) {
  const router = Router();

  router.get('/csrf', (req, res) => {
    const token = ensureCsrfToken(req);
    ok(res, { csrfToken: token });
  });

  router.get('/me', (req, res) => {
    try {
      if (!req.session.user) {
        throw new UnauthorizedError();
      }
      ok(res, req.session.user);
    } catch (error) {
      fail(res, error);
    }
  });

  router.post(
    '/login',
    rateLimit({ name: 'login', limit: 20, windowMs: 60_000 }),
    csrfProtection,
    async (req, res) => {
      try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
          throw new ValidationError('Invalid login payload');
        }
        const user = await authService.validateCredentials(
          parsed.data.email,
          parsed.data.password,
        );
        req.session.user = user;
        ensureCsrfToken(req);
        ok(res, user);
      } catch (error) {
        fail(res, error);
      }
    },
  );

  router.post('/logout', csrfProtection, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return fail(res, err);
      }
      res.clearCookie('linecard.sid');
      return ok(res, { ok: true });
    });
  });

  return router;
}
