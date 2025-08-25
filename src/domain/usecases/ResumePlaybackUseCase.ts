import type { RecorderRepository } from '@/src/domain/repositories/RecorderRepository';

export type ResumePlaybackDeps = { recorderRepository: RecorderRepository };

export class ResumePlaybackUseCase {
    private readonly repo: RecorderRepository;

    constructor({ recorderRepository }: ResumePlaybackDeps) {
        this.repo = recorderRepository;
    }

    async execute(): Promise<void> {
        await this.repo.resumePlayback();
    }
}
