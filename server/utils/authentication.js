import mongoose from "mongoose";

export async function authentication() {
  if (globalThis.loginConnection) return globalThis.association;

  const config = useRuntimeConfig();
  const db = mongoose.createConnection(config.association, {
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 20000,

    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 20000,
    socketTimeoutMS: 20000,

    authSource: "admin",
    family: 4,
  });

  globalThis.association = await db.asPromise();

  return globalThis.association;
}
