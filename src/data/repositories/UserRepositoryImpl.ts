import { http } from '@/src/data/api/ApiClient';
import type { UserRepository } from '@/src/domain/repositories/UserRepository';
import type { User } from '@/src/domain/entities/User';
import type { UserDto } from '@/src/data/dtos/UserDto';
import { mapUserDtosToUsers } from '@/src/data/mappers/UserMapper';

export class UserRepositoryImpl implements UserRepository {
  async getUsers(): Promise<User[]> {
    const data = await http<UserDto[]>('/users');
    return mapUserDtosToUsers(data);
  }
} 