import { recordAdminAudit } from './audit'
import { error, getClientIp, json } from './http'

const SESSION_COOKIE = 'admin_session'
const SESSION_TTL_SECONDS = 12 * 60 * 60
const LOGIN_WINDOW_MS = 15 * 60 * 1000
const LOGIN_MAX_FAILURES = 10
const LOGIN_RATE_PREFIX = 'rate/login/'
const PASSWORD_MIN_LENGTH = 12
const PASSWORD_MAX_LENGTH = 128
const PASSWORD_SALT_BYTES = 16
const PASSWORD_HASH_BYTES = 32
const PASSWORD_HASH_ITERATIONS = 120_000

type RateLimitState = {
  failures?: number
  windowStartedAt?: number
  lockedUntil?: number
}

type AdminCredentialRow = {
  password_hash: string
  password_salt: string
  password_algorithm: string
  password_iterations: number
  password_version: number
  password_updated_at: string
}

type AdminCredential = {
  passwordHash: string
  passwordSalt: string
  passwordAlgorithm: string
  passwordIterations: number
  passwordVersion: number
  passwordUpdatedAt: string
}

type PasswordBody = {
  currentPassword?: unknown
  newPassword?: unknown
  confirmPassword?: unknown
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlToBytes(value: string): Uint8Array {
  const padding = '='.repeat((4 - (value.length % 4)) % 4)
  const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/') + padding)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function textToBytes(text: string): Uint8Array {
  return new TextEncoder().encode(text)
}

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return bytes
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    textToBytes(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
}

async function signPayload(secret: string, payload: string): Promise<string> {
  const key = await importHmacKey(secret)
  const signature = await crypto.subtle.sign('HMAC', key, textToBytes(payload))
  return bytesToBase64Url(new Uint8Array(signature))
}

async function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): Promise<boolean> {
  if (a.byteLength !== b.byteLength) return false
  return crypto.subtle.timingSafeEqual(a, b)
}

async function timingSafeEqualString(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder()
  const [aDigest, bDigest] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(a)),
    crypto.subtle.digest('SHA-256', enc.encode(b))
  ])
  return crypto.subtle.timingSafeEqual(new Uint8Array(aDigest), new Uint8Array(bDigest))
}

async function hashPassword(
  password: string,
  salt = randomBytes(PASSWORD_SALT_BYTES),
  iterations = PASSWORD_HASH_ITERATIONS
): Promise<{ hash: string; salt: string; iterations: number }> {
  const key = await crypto.subtle.importKey(
    'raw',
    textToBytes(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  )
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256'
    },
    key,
    PASSWORD_HASH_BYTES * 8
  )
  return {
    hash: bytesToBase64Url(new Uint8Array(bits)),
    salt: bytesToBase64Url(salt),
    iterations
  }
}

async function verifyPassword(password: string, credential: AdminCredential): Promise<boolean> {
  if (credential.passwordAlgorithm !== 'pbkdf2-sha256') return false

  try {
    const salt = base64UrlToBytes(credential.passwordSalt)
    const expected = base64UrlToBytes(credential.passwordHash)
    const derived = await hashPassword(password, salt, credential.passwordIterations)
    return timingSafeEqualBytes(base64UrlToBytes(derived.hash), expected)
  } catch {
    return false
  }
}

function passwordValidationError(password: string): string | null {
  if (!password.trim()) return '新口令不能为空'
  if (password.length < PASSWORD_MIN_LENGTH) return `新口令至少需要 ${PASSWORD_MIN_LENGTH} 位`
  if (password.length > PASSWORD_MAX_LENGTH) return `新口令不能超过 ${PASSWORD_MAX_LENGTH} 位`
  return null
}

function parseCookies(header: string | null): Record<string, string> {
  const cookies: Record<string, string> = {}
  if (!header) return cookies
  for (const part of header.split(';')) {
    const index = part.indexOf('=')
    if (index === -1) continue
    const key = part.slice(0, index).trim()
    const value = part.slice(index + 1).trim()
    cookies[key] = value
  }
  return cookies
}

function sessionCookie(value: string, maxAge: number, secure: boolean): string {
  const parts = [
    `${SESSION_COOKIE}=${value}`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/api/admin',
    `Max-Age=${maxAge}`
  ]
  if (secure) parts.push('Secure')
  return parts.join('; ')
}

function authJson(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers)
  headers.set('Cache-Control', 'no-store')
  headers.set('Pragma', 'no-cache')
  return json(data, { ...init, headers })
}

function authError(status: number, message: string): Response {
  return authJson({ error: message }, { status })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  const raw = await request.text()
  if (textToBytes(raw).byteLength > 16 * 1024) throw new Error('请求内容过大')
  const parsed: unknown = JSON.parse(raw)
  if (!isRecord(parsed)) throw new Error('请求格式无效')
  return parsed
}

function mapCredential(row: AdminCredentialRow | null): AdminCredential | null {
  if (!row) return null
  if (
    typeof row.password_hash !== 'string' ||
    typeof row.password_salt !== 'string' ||
    typeof row.password_algorithm !== 'string' ||
    !Number.isInteger(row.password_iterations) ||
    row.password_iterations < 1 ||
    !Number.isInteger(row.password_version) ||
    row.password_version < 1 ||
    typeof row.password_updated_at !== 'string'
  ) {
    return null
  }

  return {
    passwordHash: row.password_hash,
    passwordSalt: row.password_salt,
    passwordAlgorithm: row.password_algorithm,
    passwordIterations: row.password_iterations,
    passwordVersion: row.password_version,
    passwordUpdatedAt: row.password_updated_at
  }
}

async function readCredential(db: D1Database | undefined): Promise<AdminCredential | null> {
  if (!db) return null
  const row = await db
    .prepare(
      `SELECT password_hash, password_salt, password_algorithm, password_iterations,
              password_version, password_updated_at
       FROM admin_credentials
       WHERE credential_id = 1`
    )
    .first<AdminCredentialRow>()
  return mapCredential(row)
}

async function bootstrapCredential(
  db: D1Database,
  password: string
): Promise<AdminCredential | null> {
  const hashed = await hashPassword(password)
  const updatedAt = new Date().toISOString()
  await db
    .prepare(
      `INSERT INTO admin_credentials
        (credential_id, password_hash, password_salt, password_algorithm,
         password_iterations, password_version, password_updated_at)
       VALUES (1, ?, ?, 'pbkdf2-sha256', ?, 1, ?)
       ON CONFLICT(credential_id) DO NOTHING`
    )
    .bind(hashed.hash, hashed.salt, hashed.iterations, updatedAt)
    .run()
  return readCredential(db)
}

async function updateCredential(
  db: D1Database,
  current: AdminCredential,
  password: string
): Promise<AdminCredential | null> {
  const hashed = await hashPassword(password)
  const updatedAt = new Date().toISOString()
  const result = await db
    .prepare(
      `UPDATE admin_credentials
       SET password_hash = ?, password_salt = ?, password_algorithm = 'pbkdf2-sha256',
           password_iterations = ?, password_version = password_version + 1,
           password_updated_at = ?
       WHERE credential_id = 1 AND password_version = ?`
    )
    .bind(hashed.hash, hashed.salt, hashed.iterations, updatedAt, current.passwordVersion)
    .run()
  if (!result.meta.changes) return null
  return readCredential(db)
}

async function readRateLimit(env: Env, key: string): Promise<RateLimitState> {
  if (!env.WECHAT_QR_BUCKET) return { failures: 0 }
  const object = await env.WECHAT_QR_BUCKET.get(key)
  if (!object) return { failures: 0 }
  try {
    return await object.json<RateLimitState>()
  } catch {
    return { failures: 0 }
  }
}

async function writeRateLimit(env: Env, key: string, data: RateLimitState): Promise<void> {
  if (!env.WECHAT_QR_BUCKET) return
  await env.WECHAT_QR_BUCKET.put(key, JSON.stringify(data), {
    httpMetadata: { contentType: 'application/json' }
  })
}

function prepareRateLimit(rate: RateLimitState, now: number, windowMs: number): boolean {
  if (rate.lockedUntil && rate.lockedUntil > now) return false
  if (
    !rate.windowStartedAt ||
    now - rate.windowStartedAt > windowMs ||
    (rate.lockedUntil && rate.lockedUntil <= now)
  ) {
    rate.failures = 0
    rate.windowStartedAt = now
    delete rate.lockedUntil
  }
  if (!rate.windowStartedAt) rate.windowStartedAt = now
  return true
}

function recordFailure(
  rate: RateLimitState,
  now: number,
  windowMs: number,
  maxFailures: number
): void {
  if (!rate.windowStartedAt || now - rate.windowStartedAt > windowMs) {
    rate.windowStartedAt = now
    rate.failures = 0
  }
  rate.failures = (rate.failures || 0) + 1
  if (rate.failures >= maxFailures) {
    rate.lockedUntil = now + windowMs
    rate.failures = 0
  }
}

export async function createSessionToken(
  secret: string,
  passwordVersion = 0
): Promise<string> {
  const payload = bytesToBase64Url(
    textToBytes(
      JSON.stringify({
        exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
        v: passwordVersion
      })
    )
  )
  const signature = await signPayload(secret, payload)
  return `${payload}.${signature}`
}

export async function isAuthenticated(request: Request, env: Env): Promise<boolean> {
  const secret = env.ADMIN_SESSION_SECRET
  if (!secret) return false

  const cookies = parseCookies(request.headers.get('Cookie'))
  const token = cookies[SESSION_COOKIE]
  if (!token) return false

  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false

  try {
    const expected = await signPayload(secret, payload)
    if (!(await timingSafeEqualString(expected, signature))) return false

    const data = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) as {
      exp?: number
      v?: number
    }
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return false

    if (env.CONTENT_DB) {
      const credential = await readCredential(env.CONTENT_DB)
      if (credential && data.v !== credential.passwordVersion) return false
      if (!credential && data.v !== undefined && data.v !== 0) return false
    }
    return true
  } catch {
    return false
  }
}

export async function handleLogin(request: Request, env: Env): Promise<Response> {
  if (!env.ADMIN_SESSION_SECRET) {
    return authError(500, '管理端尚未配置会话密钥，请联系站点维护者。')
  }

  let body: { password?: unknown }
  try {
    body = (await readJsonBody(request)) as { password?: unknown }
  } catch (cause) {
    return authError(400, cause instanceof Error ? cause.message : '请求格式无效')
  }

  const password = typeof body.password === 'string' ? body.password : ''
  const ip = getClientIp(request)
  const rateKey = `${LOGIN_RATE_PREFIX}${encodeURIComponent(ip)}`
  const rate = await readRateLimit(env, rateKey)
  const now = Date.now()

  if (!prepareRateLimit(rate, now, LOGIN_WINDOW_MS)) {
    await recordAdminAudit(env.CONTENT_DB, request, {
      action: 'auth.login.rate_limited',
      resourceType: 'admin_session',
      status: 'failure'
    })
    return authError(429, '尝试次数过多，请稍后再试')
  }

  let credential: AdminCredential | null = null
  try {
    credential = await readCredential(env.CONTENT_DB)
  } catch (cause) {
    console.error('Failed to read admin credential', cause)
    return authError(503, '认证数据库尚未初始化，请先应用 D1 迁移。')
  }

  let authenticated = false
  let passwordVersion = 0
  if (credential) {
    authenticated = await verifyPassword(password, credential)
    passwordVersion = credential.passwordVersion
  } else if (env.ADMIN_PASSWORD) {
    // Backward-compatible bootstrap: ADMIN_PASSWORD is only used to create
    // the first D1 hash. Once the row exists, it is no longer a login password.
    authenticated = await timingSafeEqualString(password, env.ADMIN_PASSWORD)
    if (authenticated && env.CONTENT_DB) {
      try {
        credential = await bootstrapCredential(env.CONTENT_DB, password)
        passwordVersion = credential?.passwordVersion || 0
      } catch (cause) {
        console.error('Failed to bootstrap admin credential', cause)
        return authError(503, '管理员口令初始化失败，请稍后重试。')
      }
    }
  }

  if (!authenticated) {
    recordFailure(rate, now, LOGIN_WINDOW_MS, LOGIN_MAX_FAILURES)
    await writeRateLimit(env, rateKey, rate)
    await recordAdminAudit(env.CONTENT_DB, request, {
      action: 'auth.login',
      resourceType: 'admin_session',
      status: 'failure'
    })
    return authError(401, '口令错误')
  }

  await writeRateLimit(env, rateKey, { failures: 0, windowStartedAt: now })
  await recordAdminAudit(env.CONTENT_DB, request, {
    action: 'auth.login',
    resourceType: 'admin_session',
    status: 'success'
  })

  const token = await createSessionToken(env.ADMIN_SESSION_SECRET, passwordVersion)
  const secure = new URL(request.url).protocol === 'https:'
  return authJson(
    { ok: true },
    {
      headers: {
        'Set-Cookie': sessionCookie(token, SESSION_TTL_SECONDS, secure)
      }
    }
  )
}

export async function handleChangePassword(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return error(405, 'Method Not Allowed')
  const denied = await requireAdmin(request, env)
  if (denied) return denied
  if (!env.CONTENT_DB) return authError(503, '认证数据库尚未配置，请先配置 CONTENT_DB。')

  let body: PasswordBody
  try {
    body = (await readJsonBody(request)) as PasswordBody
  } catch (cause) {
    return authError(400, cause instanceof Error ? cause.message : '请求格式无效')
  }

  const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : ''
  const newPassword = typeof body.newPassword === 'string' ? body.newPassword : ''
  const confirmPassword = typeof body.confirmPassword === 'string' ? body.confirmPassword : ''
  const validationError = passwordValidationError(newPassword)
  if (validationError) return authError(400, validationError)
  if (newPassword !== confirmPassword) return authError(400, '两次输入的新口令不一致')

  const credential = await readCredential(env.CONTENT_DB)
  if (!credential || !(await verifyPassword(currentPassword, credential))) {
    await recordAdminAudit(env.CONTENT_DB, request, {
      action: 'auth.password.change',
      resourceType: 'admin_credential',
      status: 'failure'
    })
    return authError(403, '当前口令错误')
  }
  if (await timingSafeEqualString(currentPassword, newPassword)) {
    return authError(400, '新口令不能与当前口令相同')
  }

  const updated = await updateCredential(env.CONTENT_DB, credential, newPassword)
  if (!updated) return authError(409, '口令已被其他操作更新，请刷新后重试')

  await recordAdminAudit(env.CONTENT_DB, request, {
    action: 'auth.password.change',
    resourceType: 'admin_credential',
    status: 'success',
    details: { passwordVersion: updated.passwordVersion }
  })

  const token = await createSessionToken(env.ADMIN_SESSION_SECRET, updated.passwordVersion)
  const secure = new URL(request.url).protocol === 'https:'
  return authJson(
    { ok: true },
    {
      headers: {
        'Set-Cookie': sessionCookie(token, SESSION_TTL_SECONDS, secure)
      }
    }
  )
}

export async function handleAuditLogs(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'GET') return error(405, 'Method Not Allowed')
  const denied = await requireAdmin(request, env)
  if (denied) return denied
  if (!env.CONTENT_DB) return authError(503, '审计数据库尚未配置。')

  await recordAdminAudit(env.CONTENT_DB, request, {
    action: 'audit.read',
    resourceType: 'admin_audit_logs',
    status: 'success'
  })

  const rawLimit = Number(new URL(request.url).searchParams.get('limit') || 50)
  const limit = Number.isInteger(rawLimit) ? Math.min(Math.max(rawLimit, 1), 100) : 50
  const result = await env.CONTENT_DB
    .prepare(
      `SELECT id, action, resource_type, resource_id, status, ip_address,
              user_agent, details_json, created_at
       FROM admin_audit_logs
       ORDER BY id DESC
       LIMIT ?1`
    )
    .bind(limit)
    .all<{
      id: number
      action: string
      resource_type: string | null
      resource_id: string | null
      status: string
      ip_address: string | null
      user_agent: string | null
      details_json: string | null
      created_at: string
    }>()

  return authJson({
    logs: result.results.map((row) => {
      let details: Record<string, unknown> | null = null
      if (row.details_json) {
        try {
          details = JSON.parse(row.details_json) as Record<string, unknown>
        } catch {
          details = null
        }
      }
      return {
        id: row.id,
        action: row.action,
        resourceType: row.resource_type,
        resourceId: row.resource_id,
        status: row.status,
        ipAddress: row.ip_address,
        userAgent: row.user_agent,
        details,
        createdAt: row.created_at
      }
    })
  })
}

export async function handleLogout(request: Request, env: Env): Promise<Response> {
  await recordAdminAudit(env.CONTENT_DB, request, {
    action: 'auth.logout',
    resourceType: 'admin_session',
    status: 'success'
  })
  const secure = new URL(request.url).protocol === 'https:'
  return authJson(
    { ok: true },
    {
      headers: {
        'Set-Cookie': sessionCookie('', 0, secure)
      }
    }
  )
}

export async function requireAdmin(request: Request, env: Env): Promise<Response | null> {
  if (!(await isAuthenticated(request, env))) {
    return error(401, '未登录或会话已过期')
  }
  return null
}
