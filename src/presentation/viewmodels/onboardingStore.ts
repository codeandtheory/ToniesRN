import { create } from 'zustand';
import { container } from '@/src/di/container';
import '@/src/di/providers';
import type { SaveLocalUserUseCase } from '@/src/domain/usecases/SaveLocalUserUseCase';
import type { GetLocalUserUseCase } from '@/src/domain/usecases/GetLocalUserUseCase';

type Gender = 'boy' | 'girl' | 'na';

export type OnboardingState = {
    name: string;
    gender: Gender | null;
    dob: Date | null;
    isSaving: boolean;
    errorMessage: string | null;
};

export type OnboardingActions = {
    setName: (value: string) => void;
    setGender: (value: Gender | null) => void;
    setDob: (value: Date | null) => void;
    load: () => Promise<void>;
    save: () => Promise<void>;
    clearError: () => void;
};

const saveLocalUserUseCase = container.resolve<SaveLocalUserUseCase>('saveLocalUserUseCase');
const getLocalUserUseCase = container.resolve<GetLocalUserUseCase>('getLocalUserUseCase');

export const useOnboardingStore = create<OnboardingState & OnboardingActions>((set, get) => ({
    name: '',
    gender: null,
    dob: null,
    isSaving: false,
    errorMessage: null,

    setName: (value: string) => set({ name: value }),
    setGender: (value: Gender | null) => set({ gender: value }),
    setDob: (value: Date | null) => set({ dob: value }),

    load: async () => {
        try {
            const user = await getLocalUserUseCase.execute();
            if (user) {
                set({
                    name: user.name,
                    gender: user.gender as Gender,
                    dob: new Date(user.dob),
                });
            }
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Failed to load profile';
            set({ errorMessage: message });
        }
    },

    save: async () => {
        const { name, gender, dob } = get();
        if (!name || !gender || !dob) {
            set({ errorMessage: 'Please complete all fields' });
            return;
        }
        set({ isSaving: true, errorMessage: null });
        try {
            await saveLocalUserUseCase.execute({
                name,
                gender,
                dob: dob.getTime(),
            } as any);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Failed to save profile';
            set({ errorMessage: message });
        } finally {
            set({ isSaving: false });
        }
    },

    clearError: () => set({ errorMessage: null }),
}));


