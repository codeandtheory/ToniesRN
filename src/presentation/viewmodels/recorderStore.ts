import { create } from 'zustand';
import { container } from '@/src/di/container';
import type { StartRecordingUseCase } from '@/src/domain/usecases/StartRecordingUseCase';
import type { StopAndSaveRecordingUseCase } from '@/src/domain/usecases/StopAndSaveRecordingUseCase';
import type { ListRecordingsUseCase } from '@/src/domain/usecases/ListRecordingsUseCase';
import type { PlayRecordingUseCase } from '@/src/domain/usecases/PlayRecordingUseCase';
import type { PauseRecordingUseCase } from '@/src/domain/usecases/PauseRecordingUseCase';
import type { ResumeRecordingUseCase } from '@/src/domain/usecases/ResumeRecordingUseCase';
import type { RecordingItem } from '@/src/domain/entities/RecordingItem';

function resolve<T>(key: string): T {
  try {
    return container.resolve<T>(key as any);
  } catch (error) {
    console.error(`Failed to resolve ${key}:`, error);
    throw new Error(`Dependency injection failed for ${key}`);
  }
}

export type RecorderState = {
  isRecording: boolean;
  isPreparing: boolean;
  isStopping: boolean;
  isPaused: boolean;
  errorMessage: string | null;
  items: RecordingItem[];
};

export type RecorderActions = {
  load: () => Promise<void>;
  start: () => Promise<void>;
  stopAndSave: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  play: (uri: string) => Promise<void>;
  clearError: () => void;
};

export const useRecorderStore = create<RecorderState & RecorderActions>((set, get) => ({
  isRecording: false,
  isPreparing: false,
  isStopping: false,
  isPaused: false,
  errorMessage: null,
  items: [],

  load: async () => {
    try {
      const listRecordingsUseCase = resolve<ListRecordingsUseCase>('listRecordingsUseCase');
      const items = await listRecordingsUseCase.execute();
      set({ items });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load recordings';
      set({ errorMessage: msg });
    }
  },

  start: async () => {
    const { isPreparing, isRecording } = get();
    if (isPreparing || isRecording) return;
    set({ isPreparing: true, errorMessage: null });
    try {
      const startRecordingUseCase = resolve<StartRecordingUseCase>('startRecordingUseCase');
      await startRecordingUseCase.execute();
      set({ isRecording: true, isPaused: false });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to start recording';
      set({ errorMessage: msg });
    } finally {
      set({ isPreparing: false });
    }
  },

  pause: async () => {
    const { isRecording, isPaused } = get();
    if (!isRecording || isPaused) return;
    try {
      const pauseRecordingUseCase = resolve<PauseRecordingUseCase>('pauseRecordingUseCase');
      await pauseRecordingUseCase.execute();
      set({ isPaused: true });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to pause recording';
      set({ errorMessage: msg });
    }
  },

  resume: async () => {
    const { isRecording, isPaused } = get();
    if (!isRecording || !isPaused) return;
    try {
      const resumeRecordingUseCase = resolve<ResumeRecordingUseCase>('resumeRecordingUseCase');
      await resumeRecordingUseCase.execute();
      set({ isPaused: false });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to resume recording';
      set({ errorMessage: msg });
    }
  },

  stopAndSave: async () => {
    const { isStopping, isRecording } = get();
    if (isStopping || !isRecording) return;
    set({ isStopping: true });
    try {
      const stopAndSaveRecordingUseCase = resolve<StopAndSaveRecordingUseCase>('stopAndSaveRecordingUseCase');
      const item = await stopAndSaveRecordingUseCase.execute();
      if (item) {
        set((s) => ({ items: [...s.items, item] }));
      }
      set({ isRecording: false, isPaused: false });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to stop recording';
      set({ errorMessage: msg });
    } finally {
      set({ isStopping: false });
    }
  },

  play: async (uri: string) => {
    try {
      const playRecordingUseCase = resolve<PlayRecordingUseCase>('playRecordingUseCase');
      await playRecordingUseCase.execute(uri);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to play recording';
      set({ errorMessage: msg });
    }
  },

  clearError: () => set({ errorMessage: null }),
}));
