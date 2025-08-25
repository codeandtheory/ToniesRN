import { LocalUser } from "../entities/LocalUser";

export interface LocalUserRepository {
    addUser(localUser: LocalUser): Promise<void>;
    getUser(): Promise<LocalUser | null>;
};