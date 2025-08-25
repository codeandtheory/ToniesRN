import { LocalUser } from "@/src/domain/entities/LocalUser";
import { LocalUserRepository } from "@/src/domain/repositories/LocalUserRepository";
import { db } from "../db/DbClient";

export class LocalUserRepositoryImpl implements LocalUserRepository {

    
    async addUser(localUser: LocalUser): Promise<void> {
        await db.runAsync("INSERT INTO USERS(NAME, GENDER, DOB) VALUES(?, ?, ?)", [localUser.name, localUser.gender, localUser.dob]);
    }
    
    
    async getUser(): Promise<LocalUser | null> {
        return await db.getFirstAsync<LocalUser>("SELECT * FROM USERS");
    }
    
}