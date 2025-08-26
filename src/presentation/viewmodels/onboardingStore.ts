import { create } from 'zustand';
import { container } from '@/src/di/container';
import '@/src/di/providers';
import type { GetUsersUseCase } from '@/src/domain/usecases/GetUsersUseCase';
import { LocalUser } from '@/src/domain/entities/LocalUser';
import { LocalUsersUseCase } from '@/src/domain/usecases/LocalUserUseCase';

export type LocalUserViewState = {
  user: LocalUser | null;
  isLoading: boolean;
  errorMessage: string | null;
};

export type UsersViewActions = {
  loadUsers: () => Promise<void>;
  storeUser: (name: string, gender: string, dob: number) => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
};

const localUserUseCase = container.resolve<LocalUsersUseCase>('localUserUseCase');

export const useLocalUsersStore = create<LocalUserViewState & UsersViewActions>((set) => ({
  user: null,
  isLoading: false,
  errorMessage: null,

  loadUsers: async () => {
    set({ isLoading: true, errorMessage: null });
    try {
      const localUser = await localUserUseCase.execute();
      console.log( "store loadUsers",  );
      set({ user: localUser, isLoading: false, errorMessage: null });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load users';
      set({ errorMessage: message, isLoading: false });
    }
  },

  storeUser: async (name: string, gender: string, dob: number) => {
    console.log( "storeUser" );
    const localUser: LocalUser = {
        id: 1,
        name: name,
        gender: gender,
        dob: dob,
    };
    console.log( "storeUser ",  localUser );
    set({ isLoading: true, errorMessage: null });
    try {
    console.log( "inside try ",  localUser );
      const user = await localUserUseCase.store(localUser);
      set({ user: localUser, isLoading: false, errorMessage: null });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save user';
      set({ errorMessage: message, isLoading: false });
    }
  },

  refresh: async () => {
    set({ isLoading: true });
    try {
      const users = await localUserUseCase.execute();
      set({ user:users, isLoading: false, errorMessage: null });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to refresh users';
      set({ errorMessage: message, isLoading: false });
    }
  },

  clearError: () => set({ errorMessage: null }),
})); 