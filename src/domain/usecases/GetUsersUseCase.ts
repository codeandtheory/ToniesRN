import { User } from '@/src/domain/entities/User';
import type { UserRepository } from '@/src/domain/repositories/UserRepository';

export type GetUsersUseCaseDeps = {
  userRepository: UserRepository;
};

export class GetUsersUseCase {
  private readonly userRepository: UserRepository;

  constructor({ userRepository }: GetUsersUseCaseDeps) {
    this.userRepository = userRepository;
  }

  async execute(): Promise<User[]> {
    return this.userRepository.getUsers();
  }
} 