import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient } from "@libsql/client";

import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

async function main() {
  const db = drizzle(
    createClient({
      url: process.env.TURSO_DB_URL!,
      authToken: process.env.TURSO_DB_TOKEN,
    }),
  );

  console.log("Running migrations");

  await migrate(db, { migrationsFolder: "src/db/migrations" });

  console.log("Migrations complete!");

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
