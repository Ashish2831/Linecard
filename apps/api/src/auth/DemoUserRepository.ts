import bcrypt from 'bcryptjs';
import type { User } from '../domain/types.js';
import type { IUserRepository } from './IUserRepository.js';

export class DemoUserRepository implements IUserRepository {
  private user: User | null = null;

  constructor(
    private readonly email: string,
    private readonly password: string,
  ) {}

  async init(): Promise<void> {
    const passwordHash = await bcrypt.hash(this.password, 10);
    this.user = {
      id: 'demo-user-1',
      email: this.email.toLowerCase(),
      passwordHash,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!this.user) {
      await this.init();
    }
    if (!this.user) return null;
    return this.user.email === email.toLowerCase() ? this.user : null;
  }
}
