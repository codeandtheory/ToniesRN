import type { RecordingItem } from '@/src/domain/entities/RecordingItem';

export interface RecorderRepository {
  requestPermission(): Promise<boolean>;
  start(): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  stop(): Promise<{ tempUri: string; durationMs: number } | null>;
  save(tempUri: string, durationMs: number): Promise<RecordingItem>;
  list(): Promise<RecordingItem[]>;
  play(uri: string): Promise<void>;
  pausePlayback(): Promise<void>;
  resumePlayback(): Promise<void>;
  stopPlayback(): Promise<void>;
  seekPlayback(position: number): Promise<void>;
  getPlaybackStatus(): Promise<{ isPlaying: boolean; position: number; duration: number }>;
}
