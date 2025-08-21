import type { RecorderRepository } from '@/src/domain/repositories/RecorderRepository';
import type { RecordingItem } from '@/src/domain/entities/RecordingItem';

export type StopAndSaveRecordingDeps = { recorderRepository: RecorderRepository };

export class StopAndSaveRecordingUseCase {
  private readonly repo: RecorderRepository;
  constructor({ recorderRepository }: StopAndSaveRecordingDeps) {
    this.repo = recorderRepository;
  }
  async execute(): Promise<RecordingItem | null> {
    const result = await this.repo.stop();
    if (!result) return null;
    const { tempUri, durationMs } = result;
    return this.repo.save(tempUri, durationMs);
  }
}
