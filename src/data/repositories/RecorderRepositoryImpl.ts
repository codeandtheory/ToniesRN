import {Audio, AVPlaybackStatus} from 'expo-av';
import * as FileSystem from 'expo-file-system';
import type { RecorderRepository } from '@/src/domain/repositories/RecorderRepository';
import type { RecordingItem } from '@/src/domain/entities/RecordingItem';

function formatMs(ms: number) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60).toString().padStart(2, '0');
  const s = Math.floor(total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export class RecorderRepositoryImpl implements RecorderRepository {
  private currentRecording: Audio.Recording | null = null;
  private currentSound: Audio.Sound | null = null;

  async requestPermission(): Promise<boolean> {
    const { granted } = await Audio.requestPermissionsAsync();
    return granted;
  }

  async start(): Promise<void> {
    if (this.currentRecording) {
      try {
        await this.currentRecording.stopAndUnloadAsync();
      } catch { }
      this.currentRecording = null;
    }

    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await rec.startAsync();
    this.currentRecording = rec;
  }

  async pause(): Promise<void> {
    if (!this.currentRecording) return;
    try {
      await this.currentRecording.pauseAsync();
    } catch { }
  }

  async resume(): Promise<void> {
    if (!this.currentRecording) return;
    try {
      await this.currentRecording.startAsync();
    } catch { }
  }

  async stop(): Promise<{ tempUri: string; durationMs: number } | null> {
    if (!this.currentRecording) return null;
    // capture status before unloading to compute duration
    let durationMs = 0;
    try {
      const status = await this.currentRecording.getStatusAsync();
      if ('durationMillis' in status && typeof status.durationMillis === 'number') {
        durationMs = status.durationMillis;
      }
    } catch { }

    await this.currentRecording.stopAndUnloadAsync();
    const uri = this.currentRecording.getURI();
    this.currentRecording = null;
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true });
    if (!uri) return null;
    return { tempUri: uri, durationMs };
  }

  async save(tempUri: string, durationMs: number): Promise<RecordingItem> {
    const dir = FileSystem.documentDirectory + 'recordings/';
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const filename = `Recording ${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}.m4a`;

    const dest = dir + filename;
    await FileSystem.moveAsync({ from: tempUri, to: dest });

    return { uri: dest, filename, durationMs: formatMs(durationMs) };
  }

  async list(): Promise<RecordingItem[]> {
    const dir = FileSystem.documentDirectory + 'recordings/';
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true }).catch(() => { });
    const files = await FileSystem.readDirectoryAsync(dir).catch(() => []);
    const items: RecordingItem[] = [];

    for (const filename of files) {
      const uri = dir + filename;
      let durationMs = 0;
      try {
        const { sound } = await Audio.Sound.createAsync({ uri });
        const status = await sound.getStatusAsync();
        if (status.isLoaded && typeof status.durationMillis === 'number') {
          durationMs = status.durationMillis;
        }
        await sound.unloadAsync(); // Unload the sound to free resources
      } catch (error) {
        console.error(`Failed to get duration for file ${filename}:`, error);
      }

      items.push({ uri, filename, durationMs: formatMs(durationMs) });
    }

    return items;
  }

  async play(uri: string, onPlaybackStatusUpdate?: (status: AVPlaybackStatus) => void): Promise<void> {
    // Stop any currently playing sound
    if (this.currentSound) {
      try {
        await this.currentSound.unloadAsync();
      } catch {}
      this.currentSound = null;
    }

    const { sound } = await Audio.Sound.createAsync({ uri });
    this.currentSound = sound;
    await sound.playAsync();

    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;
      if (onPlaybackStatusUpdate) {
        onPlaybackStatusUpdate(status); // Send the playback status to the callback
      }
      if (status.didJustFinish) {
        sound.unloadAsync();
        this.currentSound = null;
      }
    });
  }

  async pausePlayback(): Promise<void> {
    if (this.currentSound) {
      try {
        await this.currentSound.pauseAsync();
      } catch { }
    }
  }

  async resumePlayback(): Promise<void> {
    if (this.currentSound) {
      try {
        await this.currentSound.playAsync();
      } catch { }
    }
  }

  async stopPlayback(): Promise<void> {
    if (this.currentSound) {
      try {
        await this.currentSound.unloadAsync();
      } catch { }
      this.currentSound = null;
    }
  }

  async seekPlayback(position: number): Promise<void> {
    if (this.currentSound) {
      try {
        await this.currentSound.setPositionAsync(position);
      } catch { }
    }
  }
}
