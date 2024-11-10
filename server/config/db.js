import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, '../data/db.json');

const adapter = new JSONFile(file);
const defaultData = {
  matches: {},
  likedRestaurants: {}
};

const db = new Low(adapter, defaultData);

// Initialize database with default data
await db.read();
if (!db.data) {
  db.data = defaultData;
  await db.write();
}

export default db;