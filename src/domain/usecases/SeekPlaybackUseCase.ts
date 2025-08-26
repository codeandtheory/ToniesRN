import type { RecorderRepository } from '@/src/domain/repositories/RecorderRepository';

export type SeekPlaybackDeps = { recorderRepository: RecorderRepository };

export class SeekPlaybackUseCase {
    private readonly repo: RecorderRepository;

    constructor({ recorderRepository }: SeekPlaybackDeps) {
        this.repo = recorderRepository;
    }

    async execute(position: number): Promise<void> {
        await this.repo.seekPlayback(position);
    }
}
