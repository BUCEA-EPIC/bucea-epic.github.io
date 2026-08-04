import { pbkdf2Sync, randomBytes } from 'node:crypto'

// Keep these values in sync with server/lib/auth.ts. The generated SQL only
// contains the salted hash, never the ADMIN_PASSWORD plaintext.
const PASSWORD_MIN_LENGTH = 12
const PASSWORD_MAX_LENGTH = 128
const PASSWORD_SALT_BYTES = 16
const PASSWORD_HASH_BYTES = 32
const PASSWORD_HASH_ITERATIONS = 120_000

const password = process.env.ADMIN_PASSWORD || ''

if (!password.trim()) {
  process.stderr.write('ADMIN_PASSWORD must not be empty.\n')
  process.exit(1)
}

if (password.length < PASSWORD_MIN_LENGTH) {
  process.stderr.write(`ADMIN_PASSWORD must be at least ${PASSWORD_MIN_LENGTH} characters.\n`)
  process.exit(1)
}

if (password.length > PASSWORD_MAX_LENGTH) {
  process.stderr.write(`ADMIN_PASSWORD must not exceed ${PASSWORD_MAX_LENGTH} characters.\n`)
  process.exit(1)
}

function base64Url(buffer) {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`
}

const salt = randomBytes(PASSWORD_SALT_BYTES)
const hash = pbkdf2Sync(password, salt, PASSWORD_HASH_ITERATIONS, PASSWORD_HASH_BYTES, 'sha256')
const updatedAt = new Date().toISOString()
const details = JSON.stringify({
  source: 'github-actions',
  workflow: process.env.GITHUB_WORKFLOW || 'reset-admin-password',
  actor: process.env.GITHUB_ACTOR || 'unknown',
  runId: process.env.GITHUB_RUN_ID || 'unknown',
  commit: process.env.GITHUB_SHA || 'unknown'
})

const sql = `-- Generated at deployment time. Do not commit this file.
-- D1 remote SQL does not allow explicit BEGIN/COMMIT statements.
INSERT INTO admin_credentials
  (credential_id, password_hash, password_salt, password_algorithm,
   password_iterations, password_version, password_updated_at)
VALUES
  (1, ${sqlString(base64Url(hash))}, ${sqlString(base64Url(salt))},
   'pbkdf2-sha256', ${PASSWORD_HASH_ITERATIONS}, 1, ${sqlString(updatedAt)})
ON CONFLICT(credential_id) DO UPDATE SET
  password_hash = excluded.password_hash,
  password_salt = excluded.password_salt,
  password_algorithm = excluded.password_algorithm,
  password_iterations = excluded.password_iterations,
  password_version = admin_credentials.password_version + 1,
  password_updated_at = excluded.password_updated_at;
INSERT INTO admin_audit_logs
  (action, resource_type, resource_id, status, ip_address, user_agent, details_json, created_at)
VALUES
  ('auth.password.recovery.deployment', 'admin_credential', '1', 'success',
   NULL, 'GitHub Actions', ${sqlString(details)}, ${sqlString(updatedAt)});
`

process.stdout.write(sql)
