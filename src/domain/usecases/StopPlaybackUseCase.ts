import type { RecorderRepository } from '@/src/domain/repositories/RecorderRepository';

export type StopPlaybackDeps = { recorderRepository: RecorderRepository };

export class StopPlaybackUseCase {
    private readonly repo: RecorderRepository;

    constructor({ recorderRepository }: StopPlaybackDeps) {
        this.repo = recorderRepository;
    }

    async execute(): Promise<void> {
        await this.repo.stopPlayback();
    }
}
