import { MongoClient, type Db } from 'mongodb';
import { env } from '$env/dynamic/private';

const uri = env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = env.MONGODB_DB_NAME || 'cvforge';

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromiseCVForge: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromiseCVForge) {
    client = new MongoClient(uri);
    global._mongoClientPromiseCVForge = client.connect();
  }
  clientPromise = global._mongoClientPromiseCVForge;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
  const c = await clientPromise;
  return c.db(dbName);
}

let indexesDone = false;
export async function initDbIndexes(): Promise<void> {
  if (indexesDone) return;
  try {
    const db = await getDb();
    await db.collection('users').createIndex({ googleId: 1 }, { unique: true, sparse: true });
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('resumes').createIndex({ userId: 1, updatedAt: -1 });
    indexesDone = true;
  } catch (err) {
    console.warn('Index initialization note:', (err as Error).message);
  }
}
