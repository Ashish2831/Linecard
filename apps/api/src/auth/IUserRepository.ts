import type { User } from '../domain/types.js';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
}
