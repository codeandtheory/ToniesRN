import type { RecorderRepository } from '@/src/domain/repositories/RecorderRepository';

export type PausePlaybackDeps = { recorderRepository: RecorderRepository };

export class PausePlaybackUseCase {
    private readonly repo: RecorderRepository;

    constructor({ recorderRepository }: PausePlaybackDeps) {
        this.repo = recorderRepository;
    }

    async execute(): Promise<void> {
        await this.repo.pausePlayback();
    }
}
