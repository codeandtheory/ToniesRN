import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("app.db")

export const setupDb = async () => {
    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS USERS(
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        NAME TEXT NOT NULL,
        GENDER TEXT NOT NULL,
        DOB INTEGER NOT NULL);`
    );
};