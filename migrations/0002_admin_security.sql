-- Shared administrator credential and operational audit trail.
-- Passwords are stored as PBKDF2-SHA-256 hashes, never as plaintext.
CREATE TABLE IF NOT EXISTS admin_credentials (
  credential_id INTEGER PRIMARY KEY CHECK (credential_id = 1),
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  password_algorithm TEXT NOT NULL DEFAULT 'pbkdf2-sha256',
  password_iterations INTEGER NOT NULL DEFAULT 100000,
  password_version INTEGER NOT NULL DEFAULT 1,
  password_updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('success', 'failure')),
  ip_address TEXT,
  user_agent TEXT,
  details_json TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at
  ON admin_audit_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action
  ON admin_audit_logs (action, created_at DESC);
