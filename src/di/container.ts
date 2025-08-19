import { createContainer, asClass, type AwilixContainer, InjectionMode } from 'awilix';
import { UserRepositoryImpl } from '@/src/data/repositories/UserRepositoryImpl';
import { GetUsersUseCase } from '@/src/domain/usecases/GetUsersUseCase';

export type AppContainer = AwilixContainer;

export const container: AppContainer = createContainer({ injectionMode: InjectionMode.PROXY });

// Register classes as singletons
container.register({
  userRepository: asClass(UserRepositoryImpl).singleton(),
  getUsersUseCase: asClass(GetUsersUseCase).singleton(),
}); 