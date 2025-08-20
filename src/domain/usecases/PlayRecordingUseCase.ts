import type { RecorderRepository } from '@/src/domain/repositories/RecorderRepository';

export type PlayRecordingDeps = { recorderRepository: RecorderRepository };

export class PlayRecordingUseCase {
  private readonly repo: RecorderRepository;
  constructor({ recorderRepository }: PlayRecordingDeps) {
    this.repo = recorderRepository;
  }
  async execute(uri: string): Promise<void> {
    return this.repo.play(uri);
  }
}
