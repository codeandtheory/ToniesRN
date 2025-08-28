import type { LocalUser } from '@/src/domain/entities/LocalUser';
import type { LocalUserRepository } from '@/src/domain/repositories/LocalUserRepository';

export type GetLocalUserUseCaseDeps = {
    localUserRepository: LocalUserRepository;
};

export class GetLocalUserUseCase {
    private readonly localUserRepository: LocalUserRepository;

    constructor({ localUserRepository }: GetLocalUserUseCaseDeps) {
        this.localUserRepository = localUserRepository;
    }

    async execute(): Promise<LocalUser | null> {
        return this.localUserRepository.getUser();
    }
}


