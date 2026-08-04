import { error, getClientIp, json } from './http'

const SESSION_COOKIE = 'admin_session'
const SESSION_TTL_SECONDS = 12 * 60 * 60
const LOGIN_WINDOW_MS = 15 * 60 * 1000
const LOGIN_MAX_FAILURES = 10
const RATE_PREFIX = 'rate/login/'

type RateLimitState = {
  failures?: number
  windowStartedAt?: number
  lockedUntil?: number
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function textToBytes(text: string): Uint8Array {
  return new TextEncoder().encode(text)
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

async function timingSafeEqualString(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder()
  const [aDigest, bDigest] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(a)),
    crypto.subtle.digest('SHA-256', enc.encode(b))
  ])
  return crypto.subtle.timingSafeEqual(new Uint8Array(aDigest), new Uint8Array(bDigest))
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

export async function createSessionToken(secret: string): Promise<string> {
  const payload = bytesToBase64Url(
    textToBytes(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }))
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

  const expected = await signPayload(secret, payload)
  if (!(await timingSafeEqualString(expected, signature))) return false

  try {
    const data = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) as {
      exp?: number
    }
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return false
    return true
  } catch {
    return false
  }
}

async function readRateLimit(env: Env, ip: string): Promise<RateLimitState> {
  if (!env.WECHAT_QR_BUCKET) return { failures: 0 }
  const object = await env.WECHAT_QR_BUCKET.get(`${RATE_PREFIX}${ip}`)
  if (!object) return { failures: 0 }
  try {
    return await object.json<RateLimitState>()
  } catch {
    return { failures: 0 }
  }
}

async function writeRateLimit(env: Env, ip: string, data: RateLimitState): Promise<void> {
  if (!env.WECHAT_QR_BUCKET) return
  await env.WECHAT_QR_BUCKET.put(`${RATE_PREFIX}${ip}`, JSON.stringify(data), {
    httpMetadata: { contentType: 'application/json' }
  })
}

export async function handleLogin(request: Request, env: Env): Promise<Response> {
  if (!env.ADMIN_PASSWORD || !env.ADMIN_SESSION_SECRET) {
    return error(500, '管理端尚未配置密钥，请联系站点维护者。')
  }

  let body: { password?: unknown }
  try {
    body = await request.json()
  } catch {
    return error(400, '请求格式无效')
  }

  const password = typeof body.password === 'string' ? body.password : ''
  const ip = getClientIp(request)
  const rate = await readRateLimit(env, ip)
  const now = Date.now()

  if (rate.lockedUntil && rate.lockedUntil > now) {
    return error(429, '尝试次数过多，请稍后再试')
  }

  if (rate.windowStartedAt && now - rate.windowStartedAt > LOGIN_WINDOW_MS) {
    rate.failures = 0
    rate.windowStartedAt = now
  }

  if (!rate.windowStartedAt) rate.windowStartedAt = now

  if (!(await timingSafeEqualString(password, env.ADMIN_PASSWORD))) {
    rate.failures = (rate.failures || 0) + 1
    if (rate.failures >= LOGIN_MAX_FAILURES) {
      rate.lockedUntil = now + LOGIN_WINDOW_MS
      rate.failures = 0
    }
    await writeRateLimit(env, ip, rate)
    return error(401, '口令错误')
  }

  await writeRateLimit(env, ip, { failures: 0, windowStartedAt: now })

  const token = await createSessionToken(env.ADMIN_SESSION_SECRET)
  const secure = new URL(request.url).protocol === 'https:'
  return json(
    { ok: true },
    {
      headers: {
        'Set-Cookie': sessionCookie(token, SESSION_TTL_SECONDS, secure)
      }
    }
  )
}

export async function handleLogout(request: Request): Promise<Response> {
  const secure = new URL(request.url).protocol === 'https:'
  return json(
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
