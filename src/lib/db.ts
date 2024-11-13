import { openDB, DBSchema } from 'idb';

interface CommitmentDB extends DBSchema {
  thoughts: {
    key: number;
    value: {
      id: number;
      content: string;
      timestamp: number;
    };
  };
  commitments: {
    key: number;
    value: {
      id: number;
      outcome: string;
      nextAction: string;
      timestamp: number;
    };
  };
}

const DB_NAME = 'commitment-clarity-db';
const DB_VERSION = 1;

export const initDB = async () => {
  return await openDB<CommitmentDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('thoughts')) {
        db.createObjectStore('thoughts', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('commitments')) {
        db.createObjectStore('commitments', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const dbPromise = initDB();