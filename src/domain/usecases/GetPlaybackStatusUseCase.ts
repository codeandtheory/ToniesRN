import type { RecorderRepository } from '@/src/domain/repositories/RecorderRepository';

export type GetPlaybackStatusDeps = { recorderRepository: RecorderRepository };

export class GetPlaybackStatusUseCase {
    private readonly repo: RecorderRepository;

    constructor({ recorderRepository }: GetPlaybackStatusDeps) {
        this.repo = recorderRepository;
    }

    async execute(): Promise<{ isPlaying: boolean; position: number; duration: number }> {
        return this.repo.getPlaybackStatus();
    }
}
