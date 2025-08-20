import type { RecorderRepository } from '@/src/domain/repositories/RecorderRepository';

export type PauseRecordingDeps = { recorderRepository: RecorderRepository };

export class PauseRecordingUseCase {
  private readonly repo: RecorderRepository;
  constructor({ recorderRepository }: PauseRecordingDeps) {
    this.repo = recorderRepository;
  }
  async execute(): Promise<void> {
    await this.repo.pause();
  }
}
