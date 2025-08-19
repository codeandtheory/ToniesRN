import { User } from '@/src/domain/entities/User';

export interface UserRepository {
  getUsers(): Promise<User[]>;
} 