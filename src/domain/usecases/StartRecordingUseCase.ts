import type { RecorderRepository } from '@/src/domain/repositories/RecorderRepository';

export type StartRecordingDeps = { recorderRepository: RecorderRepository };

export class StartRecordingUseCase {
  private readonly repo: RecorderRepository;
  constructor({ recorderRepository }: StartRecordingDeps) {
    this.repo = recorderRepository;
  }
  async execute(): Promise<void> {
    const granted = await this.repo.requestPermission();
    if (!granted) throw new Error('Microphone permission not granted');
    await this.repo.start();
  }
}
