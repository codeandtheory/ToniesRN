import { createContainer, asClass, type AwilixContainer, InjectionMode } from 'awilix';
import { UserRepositoryImpl } from '@/src/data/repositories/UserRepositoryImpl';
import { GetUsersUseCase } from '@/src/domain/usecases/GetUsersUseCase';
import { RecorderRepositoryImpl } from '@/src/data/repositories/RecorderRepositoryImpl';
import { StartRecordingUseCase } from '@/src/domain/usecases/StartRecordingUseCase';
import { StopAndSaveRecordingUseCase } from '@/src/domain/usecases/StopAndSaveRecordingUseCase';
import { ListRecordingsUseCase } from '@/src/domain/usecases/ListRecordingsUseCase';
import { PlayRecordingUseCase } from '@/src/domain/usecases/PlayRecordingUseCase';
import { PauseRecordingUseCase } from '@/src/domain/usecases/PauseRecordingUseCase';
import { ResumeRecordingUseCase } from '@/src/domain/usecases/ResumeRecordingUseCase';
import { PausePlaybackUseCase } from '@/src/domain/usecases/PausePlaybackUseCase';
import { ResumePlaybackUseCase } from '@/src/domain/usecases/ResumePlaybackUseCase';
import { StopPlaybackUseCase } from '@/src/domain/usecases/StopPlaybackUseCase';
import { SeekPlaybackUseCase } from '@/src/domain/usecases/SeekPlaybackUseCase';
import { LocalUserRepositoryImpl } from '../data/repositories/LocalUserRepositoryImpl';
import { LocalUsersUseCase } from '../domain/usecases/LocalUserUseCase';

export type AppContainer = AwilixContainer;

export const container: AppContainer = createContainer({ injectionMode: InjectionMode.PROXY });

container.register({
  userRepository: asClass(UserRepositoryImpl).singleton(),
  getUsersUseCase: asClass(GetUsersUseCase).singleton(),
  recorderRepository: asClass(RecorderRepositoryImpl).singleton(),
  startRecordingUseCase: asClass(StartRecordingUseCase).singleton(),
  stopAndSaveRecordingUseCase: asClass(StopAndSaveRecordingUseCase).singleton(),
  listRecordingsUseCase: asClass(ListRecordingsUseCase).singleton(),
  playRecordingUseCase: asClass(PlayRecordingUseCase).singleton(),
  pauseRecordingUseCase: asClass(PauseRecordingUseCase).singleton(),
  resumeRecordingUseCase: asClass(ResumeRecordingUseCase).singleton(),
  pausePlaybackUseCase: asClass(PausePlaybackUseCase).singleton(),
  resumePlaybackUseCase: asClass(ResumePlaybackUseCase).singleton(),
  stopPlaybackUseCase: asClass(StopPlaybackUseCase).singleton(),
  seekPlaybackUseCase: asClass(SeekPlaybackUseCase).singleton(),
  localUserRepository: asClass(LocalUserRepositoryImpl).singleton(),
  localUserUseCase: asClass(LocalUsersUseCase).singleton(),
}); 