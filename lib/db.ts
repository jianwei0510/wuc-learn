import "server-only";

import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "wuc-learn.db");

mkdirSync(dataDir, { recursive: true });

const globalForDb = globalThis as unknown as {
  db?: Database.Database;
};

export const db = globalForDb.db ?? new Database(dbPath);

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clerk_id TEXT NOT NULL UNIQUE,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    username TEXT,
    image_url TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);
