import { LocalUser } from '../entities/LocalUser';
import { LocalUserRepository } from '../repositories/LocalUserRepository';

export type LocalUsersUseCaseDeps = {
    localUserRepository: LocalUserRepository;
};

export class LocalUsersUseCase {
  private readonly localUserRepository: LocalUserRepository;

  constructor({ localUserRepository }: LocalUsersUseCaseDeps) {
    this.localUserRepository = localUserRepository;
  }

  async execute(): Promise<LocalUser | null> {

    const localUser =  await this.localUserRepository.getUser()
    console.log( "LocalUsersUseCase data ",  localUser );
    return localUser
  }

  async store(localUser: LocalUser): Promise<void> {
    console.log( "LocalUsersUseCase ",  localUser );
    return this.localUserRepository.addUser(localUser)
  }
} 