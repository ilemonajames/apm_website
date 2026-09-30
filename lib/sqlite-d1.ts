import { DatabaseSync } from "node:sqlite";

type Value = string | number | bigint | null | Uint8Array;

function sqlValue(value: unknown): Value {
  if (value === undefined) return null;
  if (typeof value === "boolean") return value ? 1 : 0;
  return value as Value;
}

class SqliteStatement {
  private values: Value[] = [];

  constructor(private database: DatabaseSync, private sql: string) {}

  bind(...values: unknown[]) {
    this.values = values.map(sqlValue);
    return this;
  }

  first<T>() {
    return (this.database.prepare(this.sql).get(...this.values) as T | undefined) ?? null;
  }

  all<T = Record<string, unknown>>() {
    return { results: this.database.prepare(this.sql).all(...this.values) as T[] };
  }

  run() {
    const result = this.database.prepare(this.sql).run(...this.values);
    return { success: true, meta: { changes: Number(result.changes) } };
  }

  execute() {
    return this.run();
  }
}

class SqliteD1 {
  constructor(private database: DatabaseSync) {}
  prepare(sql: string) { return new SqliteStatement(this.database, sql); }
  batch(statements: SqliteStatement[]) {
    this.database.exec("BEGIN");
    try {
      const results = statements.map((statement) => statement.execute());
      this.database.exec("COMMIT");
      return results;
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
  }
}

let instance: SqliteD1 | null = null;

export function getSqliteD1(path: string) {
  if (instance) return instance;
  const database = new DatabaseSync(path);
  database.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  database.exec(`
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY, membership_reference TEXT NOT NULL UNIQUE, email TEXT NOT NULL UNIQUE,
      first_name TEXT NOT NULL, middle_name TEXT, last_name TEXT NOT NULL, phone TEXT NOT NULL,
      state_code TEXT, lga_name TEXT, ward_name TEXT, photo_path TEXT,
      status TEXT NOT NULL DEFAULT 'pending_email', email_verified_at INTEGER,
      created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS member_access_codes (
      id TEXT PRIMARY KEY, member_id TEXT NOT NULL, purpose TEXT NOT NULL, code_hash TEXT NOT NULL,
      expires_at INTEGER NOT NULL, used_at INTEGER, attempt_count INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL, FOREIGN KEY(member_id) REFERENCES members(id)
    );
    CREATE INDEX IF NOT EXISTS idx_access_codes_member_purpose ON member_access_codes(member_id, purpose);
    CREATE TABLE IF NOT EXISTS member_sessions (
      id TEXT PRIMARY KEY, member_id TEXT NOT NULL, token_hash TEXT NOT NULL UNIQUE,
      expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL, last_used_at INTEGER NOT NULL,
      FOREIGN KEY(member_id) REFERENCES members(id)
    );
    CREATE TABLE IF NOT EXISTS membership_status_history (
      id TEXT PRIMARY KEY, member_id TEXT NOT NULL, from_status TEXT, to_status TEXT NOT NULL,
      reason TEXT, actor_id TEXT NOT NULL, created_at INTEGER NOT NULL,
      FOREIGN KEY(member_id) REFERENCES members(id)
    );
    CREATE TABLE IF NOT EXISTS inec_locations (
      id TEXT PRIMARY KEY, source_id TEXT NOT NULL UNIQUE, type TEXT NOT NULL, code TEXT NOT NULL,
      name TEXT NOT NULL, parent_id TEXT, retrieved_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_inec_locations_parent_type ON inec_locations(parent_id, type);
    CREATE TABLE IF NOT EXISTS elections (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, election_date INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft', application_deadline INTEGER, created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS polling_agent_applications (
      id TEXT PRIMARY KEY, application_reference TEXT NOT NULL UNIQUE, member_id TEXT NOT NULL,
      election_id TEXT NOT NULL, polling_unit_id TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'submitted',
      experience TEXT, availability_confirmed INTEGER NOT NULL DEFAULT 0,
      submitted_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
    );
  `);
  instance = new SqliteD1(database);
  return instance;
}
