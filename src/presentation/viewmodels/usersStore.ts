import { create } from 'zustand';
import { container } from '@/src/di/container';
import '@/src/di/providers';
import type { User } from '@/src/domain/entities/User';
import type { GetUsersUseCase } from '@/src/domain/usecases/GetUsersUseCase';

export type UsersViewState = {
  users: User[];
  isLoading: boolean;
  errorMessage: string | null;
};

export type UsersViewActions = {
  loadUsers: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
};

const getUsersUseCase = container.resolve<GetUsersUseCase>('getUsersUseCase');

export const useUsersStore = create<UsersViewState & UsersViewActions>((set) => ({
  users: [],
  isLoading: false,
  errorMessage: null,

  loadUsers: async () => {
    set({ isLoading: true, errorMessage: null });
    try {
      const users = await getUsersUseCase.execute();
      set({ users, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load users';
      set({ errorMessage: message, isLoading: false });
    }
  },

  refresh: async () => {
    set({ isLoading: true });
    try {
      const users = await getUsersUseCase.execute();
      set({ users, isLoading: false, errorMessage: null });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to refresh users';
      set({ errorMessage: message, isLoading: false });
    }
  },

  clearError: () => set({ errorMessage: null }),
})); 