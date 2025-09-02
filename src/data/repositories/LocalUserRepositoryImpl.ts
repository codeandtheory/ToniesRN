import { LocalUser } from "@/src/domain/entities/LocalUser";
import { LocalUserRepository } from "@/src/domain/repositories/LocalUserRepository";
import { db, setupDb } from "../db/DbClient";

export class LocalUserRepositoryImpl implements LocalUserRepository {

    
    async addUser(localUser: LocalUser): Promise<void> {
        const id = await db.runAsync("INSERT INTO USERS(name, gender, dob) VALUES(?, ?, ?)", [localUser.name, localUser.gender, localUser.dob]);
        console.log("id saved", id)
    }
    
    
    async getUser(): Promise<LocalUser | null> {
        const localUser  = await db.getFirstAsync<LocalUser>("SELECT * FROM USERS");
        console.log( "LocalUserRepositoryImpl getUser ", localUser);
        return localUser
    }
    
}