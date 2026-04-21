import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app';
import { connectDatabase } from '../src/config/database';

let connectPromise: Promise<void> | null = null;

async function ensureDatabaseConnected() {
  if (!connectPromise) {
    connectPromise = connectDatabase().catch((error) => {
      connectPromise = null;
      throw error;
    });
  }
  await connectPromise;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureDatabaseConnected();
  return app(req, res);
}
