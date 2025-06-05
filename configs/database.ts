import mongoose, { Connection } from 'mongoose';

interface Cached {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

declare global {
  var mongooseCache: Cached | undefined;
}

// Use the global cache if it exists
let cached: Cached = global.mongooseCache || { conn: null, promise: null };

if (process.env.NODE_ENV !== 'production') {
  global.mongooseCache = cached;
}

export async function connectDB(): Promise<Connection> {
  if (cached.conn) {
    console.log('MongoDB: Using cached connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('MongoDB: Connecting to database...');
    cached.promise = mongoose
      .connect(process.env.MONGO_URL!)
      .then((mongoose) => {
        console.log('MongoDB: Connected successfully');
        return mongoose.connection;
      })
      .catch((err) => {
        console.error('MongoDB: Connection failed\n', err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}