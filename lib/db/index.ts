import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import * as schema from "./schema";

const dbPath = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "arke.db");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");

export const DDL = `
CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, code TEXT NOT NULL UNIQUE, name TEXT NOT NULL, price REAL NOT NULL, lead_days INTEGER NOT NULL, material_id TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS materials (id TEXT PRIMARY KEY, code TEXT NOT NULL UNIQUE, name TEXT NOT NULL, qty INTEGER NOT NULL, min_stock INTEGER NOT NULL, location TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, email TEXT, agent TEXT, channel TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS orders (number INTEGER PRIMARY KEY AUTOINCREMENT, customer TEXT NOT NULL, agent TEXT, channel TEXT NOT NULL, status TEXT NOT NULL, promised_date TEXT NOT NULL, source_email_id INTEGER, notes TEXT);
CREATE TABLE IF NOT EXISTS order_lines (id INTEGER PRIMARY KEY AUTOINCREMENT, order_number INTEGER NOT NULL, product_id TEXT NOT NULL, qty INTEGER NOT NULL, customization TEXT);
CREATE TABLE IF NOT EXISTS order_events (id INTEGER PRIMARY KEY AUTOINCREMENT, order_number INTEGER NOT NULL, status TEXT NOT NULL, at TEXT NOT NULL, note TEXT);
CREATE TABLE IF NOT EXISTS emails (id INTEGER PRIMARY KEY AUTOINCREMENT, channel TEXT NOT NULL, from_name TEXT NOT NULL, from_address TEXT NOT NULL, subject TEXT NOT NULL, body TEXT NOT NULL, received_at TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'nuova', proposal_json TEXT, order_number INTEGER);
CREATE TABLE IF NOT EXISTS agent_runs (id INTEGER PRIMARY KEY AUTOINCREMENT, email_id INTEGER NOT NULL, mode TEXT NOT NULL, model TEXT NOT NULL, steps_json TEXT NOT NULL, started_at TEXT NOT NULL, duration_ms INTEGER NOT NULL);
`;
sqlite.exec(DDL);

export const db = drizzle(sqlite, { schema });
export { sqlite, schema };
