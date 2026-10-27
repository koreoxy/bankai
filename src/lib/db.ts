import { openDB } from 'idb';

const DB_NAME = 'bankai-db';
const STORE_NAME = 'tracks';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    },
  });
};

export const saveTrack = async (track: any) => {
  const db = await initDB();
  await db.put(STORE_NAME, track);
};

export const updateTrack = async (track: any) => {
  const db = await initDB();
  await db.put(STORE_NAME, track);
};

export const getTracks = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};
