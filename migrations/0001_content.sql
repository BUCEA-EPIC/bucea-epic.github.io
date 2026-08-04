-- Structured content store for the public site.
-- Each section is versioned independently so a content editor can update one
-- area without overwriting another editor's changes.
CREATE TABLE IF NOT EXISTS content_entries (
  content_type TEXT PRIMARY KEY NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  payload TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL DEFAULT 'admin'
);

CREATE TABLE IF NOT EXISTS content_revisions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_type TEXT NOT NULL,
  version INTEGER NOT NULL,
  payload TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL DEFAULT 'admin',
  UNIQUE (content_type, version)
);

CREATE INDEX IF NOT EXISTS idx_content_revisions_type_updated
  ON content_revisions (content_type, updated_at DESC);
