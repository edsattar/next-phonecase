import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { createClient, Client } from "@libsql/client";
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

declare global {
  var cachedClient: Client;
}
let client: Client;

if (process.env.NODE_ENV === "production") {
  client = createClient({
    url: process.env.TURSO_DB_URL!,
    authToken: process.env.TURSO_DB_TOKEN,
  });
} else {
  if (!global.cachedClient)
    global.cachedClient = createClient({
      url: process.env.TURSO_DB_URL!,
      authToken: process.env.TURSO_DB_TOKEN,
    });
  client = global.cachedClient;
}
export const db = drizzle(client, { schema });
