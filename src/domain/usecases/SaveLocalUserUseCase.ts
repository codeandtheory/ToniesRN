import type { LocalUser } from '@/src/domain/entities/LocalUser';
import type { LocalUserRepository } from '@/src/domain/repositories/LocalUserRepository';

export type SaveLocalUserUseCaseDeps = {
    localUserRepository: LocalUserRepository;
};

export class SaveLocalUserUseCase {
    private readonly localUserRepository: LocalUserRepository;

    constructor({ localUserRepository }: SaveLocalUserUseCaseDeps) {
        this.localUserRepository = localUserRepository;
    }

    async execute(localUser: Omit<LocalUser, 'id'>): Promise<void> {
        // ID is auto-increment; repository expects full LocalUser but ignores id on insert
        const userToSave: LocalUser = {
            id: 0,
            name: localUser.name,
            gender: localUser.gender,
            dob: localUser.dob,
        };
        await this.localUserRepository.addUser(userToSave);
    }
}


