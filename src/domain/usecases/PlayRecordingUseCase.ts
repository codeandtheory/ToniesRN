import type { RecorderRepository } from '@/src/domain/repositories/RecorderRepository';
import {AVPlaybackStatus} from "expo-av";

export type PlayRecordingDeps = { recorderRepository: RecorderRepository };

export class PlayRecordingUseCase {
  private readonly repo: RecorderRepository;
  constructor({ recorderRepository }: PlayRecordingDeps) {
    this.repo = recorderRepository;
  }
  async execute(uri: string, onPlaybackFinish?: (status: AVPlaybackStatus) => void): Promise<void> {
    return this.repo.play(uri, onPlaybackFinish);
  }
}
