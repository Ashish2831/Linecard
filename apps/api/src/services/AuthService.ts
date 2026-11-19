import bcrypt from 'bcryptjs';
import type { IUserRepository } from '../auth/IUserRepository.js';
import { UnauthorizedError, ValidationError } from '../domain/errors.js';
import { sanitizeEmail, sanitizeString } from '../lib/sanitize.js';

export class AuthService {
  constructor(private readonly users: IUserRepository) {}

  async validateCredentials(emailRaw: string, passwordRaw: string) {
    const email = sanitizeEmail(emailRaw);
    const password = sanitizeString(passwordRaw, 200);
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new UnauthorizedError('Invalid email or password');
    }

    return { id: user.id, email: user.email };
  }
}
