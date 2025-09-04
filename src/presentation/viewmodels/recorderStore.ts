import {create} from 'zustand';
import {container} from '@/src/di/container';
import type {StartRecordingUseCase} from '@/src/domain/usecases/StartRecordingUseCase';
import type {StopAndSaveRecordingUseCase} from '@/src/domain/usecases/StopAndSaveRecordingUseCase';
import type {ListRecordingsUseCase} from '@/src/domain/usecases/ListRecordingsUseCase';
import type {PlayRecordingUseCase} from '@/src/domain/usecases/PlayRecordingUseCase';
import type {PauseRecordingUseCase} from '@/src/domain/usecases/PauseRecordingUseCase';
import type {ResumeRecordingUseCase} from '@/src/domain/usecases/ResumeRecordingUseCase';
import type {PausePlaybackUseCase} from '@/src/domain/usecases/PausePlaybackUseCase';
import type {ResumePlaybackUseCase} from '@/src/domain/usecases/ResumePlaybackUseCase';
import type {StopPlaybackUseCase} from '@/src/domain/usecases/StopPlaybackUseCase';
import type {SeekPlaybackUseCase} from '@/src/domain/usecases/SeekPlaybackUseCase';
import type {RecordingItem} from '@/src/domain/entities/RecordingItem';

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
    // Playback state
    isPlaying: boolean;
    isPausedPlayback: boolean;
    playingUri: string | null;
    playbackPosition: number;
    playbackDuration: number;
};

export type RecorderActions = {
    load: () => Promise<void>;
    start: () => Promise<void>;
    stopAndSave: () => Promise<void>;
    pause: () => Promise<void>;
    resume: () => Promise<void>;
    play: (uri: string) => Promise<void>;
    pausePlayback: () => Promise<void>;
    resumePlayback: () => Promise<void>;
    stopPlayback: () => void;
    seekPlayback: (position: number) => void;
    clearError: () => void;
    deleteRecording: (uri: string) => void;
};

export const useRecorderStore = create<RecorderState & RecorderActions>((set, get) => ({
    isRecording: false,
    isPreparing: false,
    isStopping: false,
    isPaused: false,
    errorMessage: null,
    items: [],
    // Playback state
    isPlaying: false,
    isPausedPlayback: false,
    playingUri: null,
    playbackPosition: 0,
    playbackDuration: 0,

    load: async () => {
        try {
            const listRecordingsUseCase = resolve<ListRecordingsUseCase>('listRecordingsUseCase');
            const items = await listRecordingsUseCase.execute();
            set({items});
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Failed to load recordings';
            set({errorMessage: msg});
        }
    },

    start: async () => {
        const {isPreparing, isRecording, isPlaying} = get();
        if (isPreparing || isRecording || isPlaying) return;
        set({isPreparing: true, errorMessage: null});
        try {
            const startRecordingUseCase = resolve<StartRecordingUseCase>('startRecordingUseCase');
            await startRecordingUseCase.execute();
            set({isRecording: true, isPaused: false});
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Failed to start recording';
            set({errorMessage: msg});
        } finally {
            set({isPreparing: false});
        }
    },

    pause: async () => {
        const {isRecording, isPaused} = get();
        if (!isRecording || isPaused) return;
        try {
            const pauseRecordingUseCase = resolve<PauseRecordingUseCase>('pauseRecordingUseCase');
            await pauseRecordingUseCase.execute();
            set({isPaused: true});
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Failed to pause recording';
            set({errorMessage: msg});
        }
    },

    resume: async () => {
        const {isRecording, isPaused} = get();
        if (!isRecording || !isPaused) return;
        try {
            const resumeRecordingUseCase = resolve<ResumeRecordingUseCase>('resumeRecordingUseCase');
            await resumeRecordingUseCase.execute();
            set({isPaused: false});
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Failed to resume recording';
            set({errorMessage: msg});
        }
    },

    stopAndSave: async () => {
        const {isStopping, isRecording} = get();
        if (isStopping || !isRecording) return;
        set({isStopping: true});
        try {
            const stopAndSaveRecordingUseCase = resolve<StopAndSaveRecordingUseCase>('stopAndSaveRecordingUseCase');
            const item = await stopAndSaveRecordingUseCase.execute();
            if (item) {
                set((s) => ({items: [...s.items, item]}));
            }
            set({isRecording: false, isPaused: false});
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Failed to stop recording';
            set({errorMessage: msg});
        } finally {
            set({isStopping: false});
        }
    },

    play: async (uri: string) => {
        const {isRecording, isPlaying} = get();
        if (isRecording || isPlaying) return;

        try {
            const playRecordingUseCase = resolve<PlayRecordingUseCase>('playRecordingUseCase');
            await playRecordingUseCase.execute(uri, (status) => {
                if (!status.isLoaded) return;
                if (status.didJustFinish) {
                    set({
                        isPlaying: false,
                        isPausedPlayback: false,
                        playingUri: null,
                        playbackPosition: 0,
                        playbackDuration: 0
                    });
                } else {
                    set({
                        isPlaying: status.isPlaying,
                        playbackPosition: status.positionMillis,
                        playbackDuration: status.durationMillis
                    });
                }
            });
            set({
                isPlaying: true,
                isPausedPlayback: false,
                playingUri: uri,
                playbackPosition: 0,
                playbackDuration: 0
            });

        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Failed to play recording';
            set({errorMessage: msg});
        }
    },

    pausePlayback: async () => {
        const {isPlaying, playingUri} = get();
        if (!isPlaying || !playingUri) return;

        try {
            const pausePlaybackUseCase = resolve<PausePlaybackUseCase>('pausePlaybackUseCase');
            await pausePlaybackUseCase.execute();
            set({isPlaying: false, isPausedPlayback: true});
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Failed to pause playback';
            set({errorMessage: msg});
        }
    },

    resumePlayback: async () => {
        const {isPausedPlayback, playingUri} = get();
        if (!isPausedPlayback || !playingUri) return;

        try {
            const resumePlaybackUseCase = resolve<ResumePlaybackUseCase>('resumePlaybackUseCase');
            await resumePlaybackUseCase.execute();
            set({isPlaying: true, isPausedPlayback: false});
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Failed to resume playback';
            set({errorMessage: msg});
        }
    },

    stopPlayback: async () => {
        const {playingUri} = get();
        if (!playingUri) return;
        try {
            const stopPlaybackUseCase = resolve<StopPlaybackUseCase>('stopPlaybackUseCase');
            await stopPlaybackUseCase.execute();
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to stop playback';
            set({errorMessage: msg});
        }
        set({
            isPlaying: false,
            isPausedPlayback: false,
            playingUri: null,
            playbackPosition: 0,
            playbackDuration: 0,
        });
    },

    seekPlayback: (position: number) => {
        const {playingUri} = get();
        if (playingUri) {
            try {
                const seekPlaybackUseCase = resolve<SeekPlaybackUseCase>('seekPlaybackUseCase');
                seekPlaybackUseCase.execute(position);
            } catch (e: unknown) {
                const msg = e instanceof Error ? e.message : 'Failed to seek playback';
                set({errorMessage: msg});
            }
        }
        set({playbackPosition: position});
    },

    clearError: () => set({errorMessage: null}),

    deleteRecording: async (uri) => {
        try {
            const listRecordingsUseCase = resolve<ListRecordingsUseCase>('listRecordingsUseCase');
            const status = await listRecordingsUseCase.deleteRecording(uri)
            if (status) {
                const load = get().load;
                if (load) {
                    await load();
                }
            } else {
                set({ errorMessage: "Failed to delete recording " });
            }
        } catch (e) {
            set({ errorMessage: "Failed to delete recording: " + (e) });
        }
    }
}));
