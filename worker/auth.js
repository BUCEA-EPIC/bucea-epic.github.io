import { error, getClientIp, json } from './http.js'

const SESSION_COOKIE = 'admin_session'
const SESSION_TTL_SECONDS = 12 * 60 * 60
const LOGIN_WINDOW_MS = 15 * 60 * 1000
const LOGIN_MAX_FAILURES = 10
const RATE_PREFIX = 'rate/login/'

function bytesToBase64Url(bytes) {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlToBytes(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function textToBytes(text) {
  return new TextEncoder().encode(text)
}

async function importHmacKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    textToBytes(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

async function signPayload(secret, payload) {
  const key = await importHmacKey(secret)
  const signature = await crypto.subtle.sign('HMAC', key, textToBytes(payload))
  return bytesToBase64Url(new Uint8Array(signature))
}

async function verifySignature(secret, payload, signature) {
  const expected = await signPayload(secret, payload)
  return expected === signature
}

function parseCookies(header) {
  const cookies = {}
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

function sessionCookie(value, maxAge, secure) {
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

export async function createSessionToken(secret) {
  const payload = bytesToBase64Url(
    textToBytes(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }))
  )
  const signature = await signPayload(secret, payload)
  return `${payload}.${signature}`
}

export async function isAuthenticated(request, env) {
  const secret = env.ADMIN_SESSION_SECRET
  if (!secret) return false

  const cookies = parseCookies(request.headers.get('Cookie'))
  const token = cookies[SESSION_COOKIE]
  if (!token) return false

  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false
  if (!(await verifySignature(secret, payload, signature))) return false

  try {
    const data = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload)))
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return false
    return true
  } catch {
    return false
  }
}

async function readRateLimit(env, ip) {
  if (!env.WECHAT_QR_BUCKET) return { failures: 0 }
  const object = await env.WECHAT_QR_BUCKET.get(`${RATE_PREFIX}${ip}`)
  if (!object) return { failures: 0 }
  try {
    return await object.json()
  } catch {
    return { failures: 0 }
  }
}

async function writeRateLimit(env, ip, data) {
  if (!env.WECHAT_QR_BUCKET) return
  await env.WECHAT_QR_BUCKET.put(`${RATE_PREFIX}${ip}`, JSON.stringify(data), {
    httpMetadata: { contentType: 'application/json' }
  })
}

export async function handleLogin(request, env) {
  if (!env.ADMIN_PASSWORD || !env.ADMIN_SESSION_SECRET) {
    return error(500, '管理端尚未配置密钥，请联系站点维护者。')
  }

  let body
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

  if (password !== env.ADMIN_PASSWORD) {
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

export async function handleLogout(request) {
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

export async function requireAdmin(request, env) {
  if (!(await isAuthenticated(request, env))) {
    return error(401, '未登录或会话已过期')
  }
  return null
}
