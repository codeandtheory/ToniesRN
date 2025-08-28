import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("app.db")

export const setupDb = async () => {
    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS USERS(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        gender TEXT NOT NULL,
        dob INTEGER NOT NULL);`
    );
};