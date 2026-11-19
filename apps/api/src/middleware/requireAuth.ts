import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../domain/errors.js';
import { fail } from '../lib/responses.js';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.session.user) {
      throw new UnauthorizedError();
    }
    next();
  } catch (error) {
    fail(res, error);
  }
}
