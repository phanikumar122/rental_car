import "dotenv/config";
import { defineConfig } from "prisma/config";

// Validate DATABASE_URL early so Prisma init fails with a clear message
const databaseUrl = process.env["DATABASE_URL"];
if (!databaseUrl) {
  throw new Error("FATAL: DATABASE_URL environment variable is not set.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
