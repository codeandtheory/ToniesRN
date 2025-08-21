import type { RecorderRepository } from '@/src/domain/repositories/RecorderRepository';
import type { RecordingItem } from '@/src/domain/entities/RecordingItem';

export type ListRecordingsDeps = { recorderRepository: RecorderRepository };

export class ListRecordingsUseCase {
  private readonly repo: RecorderRepository;
  constructor({ recorderRepository }: ListRecordingsDeps) {
    this.repo = recorderRepository;
  }
  async execute(): Promise<RecordingItem[]> {
    return this.repo.list();
  }
}
