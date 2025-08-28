import { setupDb } from '@/src/data/db/DbClient';
// Ensure DB is initialized once on startup when this module is imported by stores/screens
void setupDb();

export { };