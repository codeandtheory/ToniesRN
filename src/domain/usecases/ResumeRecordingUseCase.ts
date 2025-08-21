import type { RecorderRepository } from '@/src/domain/repositories/RecorderRepository';

export type ResumeRecordingDeps = { recorderRepository: RecorderRepository };

export class ResumeRecordingUseCase {
  private readonly repo: RecorderRepository;
  constructor({ recorderRepository }: ResumeRecordingDeps) {
    this.repo = recorderRepository;
  }
  async execute(): Promise<void> {
    await this.repo.resume();
  }
}
