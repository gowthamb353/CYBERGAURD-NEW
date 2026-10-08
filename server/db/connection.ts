import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB(): Promise<boolean> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || mongoUri.includes('<username>')) {
    console.log('[Database] No valid MONGODB_URI provided. Initializing High-Performance In-Memory Cyber Store.');
    return false;
  }

  try {
    if (isConnected) return true;
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log('[Database] Connected to MongoDB Atlas successfully.');
    return true;
  } catch (error) {
    console.warn('[Database] MongoDB Atlas connection failed, falling back to In-Memory store:', (error as Error).message);
    isConnected = false;
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected;
}
