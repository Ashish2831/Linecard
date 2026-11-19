import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../domain/errors.js';
import { fail } from '../lib/responses.js';

export function ensureCsrfToken(req: Request): string {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  return req.session.csrfToken;
}

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header('x-csrf-token');
    if (!token || !req.session.csrfToken || token !== req.session.csrfToken) {
      throw new ForbiddenError('Invalid or missing CSRF token');
    }
    next();
  } catch (error) {
    fail(res, error);
  }
}
