import { requireAdmin } from '../lib/auth'
import { recordAdminAudit } from '../lib/audit'
import { error, json, publicCors } from '../lib/http'

const IMAGE_KEY = 'current'
const META_KEY = 'meta.json'
const MAX_BYTES = 2 * 1024 * 1024
const EXPIRING_DAYS = 2
const DEFAULT_TTL_DAYS = 7

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

type QrMeta = {
  updatedAt: string
  expiresAt: string
  contentType: string
  bytes: number
  etag: string
}

type PublicQrPayload = {
  available: boolean
  updatedAt: string | null
  expiresAt: string | null
  imageUrl: string | null
  status: 'missing' | 'valid' | 'expiring' | 'expired'
  contentType?: string | null
  bytes?: number | null
}

function detectImageType(bytes: Uint8Array): string | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg'
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return 'image/png'
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'image/webp'
  }
  return null
}

function computeStatus(meta: QrMeta | null, now = Date.now()): PublicQrPayload['status'] {
  if (!meta?.updatedAt || !meta?.expiresAt) return 'missing'
  const expiresAt = Date.parse(meta.expiresAt)
  if (Number.isNaN(expiresAt)) return 'missing'
  if (expiresAt <= now) return 'expired'
  if (expiresAt - now <= EXPIRING_DAYS * 24 * 60 * 60 * 1000) return 'expiring'
  return 'valid'
}

function publicPayload(meta: QrMeta | null): PublicQrPayload {
  if (!meta) {
    return {
      available: false,
      updatedAt: null,
      expiresAt: null,
      imageUrl: null,
      status: 'missing'
    }
  }

  return {
    available: true,
    updatedAt: meta.updatedAt,
    expiresAt: meta.expiresAt,
    imageUrl: '/api/wechat-qr/image',
    status: computeStatus(meta),
    contentType: meta.contentType || null,
    bytes: meta.bytes || null
  }
}

async function readMeta(env: Env): Promise<QrMeta | null> {
  if (!env.WECHAT_QR_BUCKET) return null
  const object = await env.WECHAT_QR_BUCKET.get(META_KEY)
  if (!object) return null
  try {
    return await object.json<QrMeta>()
  } catch {
    return null
  }
}

async function writeMeta(env: Env, meta: QrMeta): Promise<void> {
  await env.WECHAT_QR_BUCKET.put(META_KEY, JSON.stringify(meta), {
    httpMetadata: { contentType: 'application/json' }
  })
}

function parseExpiresAt(raw: unknown): string | null {
  if (typeof raw !== 'string' || !raw) {
    return new Date(Date.now() + DEFAULT_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString()
  }

  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

export async function handlePublicMeta(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return publicCors(new Response(null, { status: 204 }))
  }
  if (request.method !== 'GET') return error(405, 'Method Not Allowed')

  const meta = await readMeta(env)
  return publicCors(json(publicPayload(meta)))
}

export async function handlePublicImage(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return publicCors(new Response(null, { status: 204 }))
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return error(405, 'Method Not Allowed')
  }

  if (!env.WECHAT_QR_BUCKET) {
    return publicCors(error(404, '二维码尚未上传'))
  }

  const object = await env.WECHAT_QR_BUCKET.get(IMAGE_KEY)
  if (!object) {
    return publicCors(error(404, '二维码尚未上传'))
  }

  const meta = await readMeta(env)
  const headers = new Headers()
  headers.set('Content-Type', object.httpMetadata?.contentType || meta?.contentType || 'image/jpeg')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Cache-Control', 'public, max-age=300')
  if (object.httpEtag) headers.set('ETag', object.httpEtag)
  if (meta?.updatedAt) headers.set('Last-Modified', new Date(meta.updatedAt).toUTCString())

  if (request.method === 'HEAD') {
    return publicCors(new Response(null, { status: 200, headers }))
  }

  return publicCors(new Response(object.body, { status: 200, headers }))
}

export async function handleAdminMeta(request: Request, env: Env): Promise<Response> {
  const denied = await requireAdmin(request, env)
  if (denied) return denied
  if (request.method !== 'GET') return error(405, 'Method Not Allowed')

  const meta = await readMeta(env)
  const payload = publicPayload(meta)
  return json({
    ...payload,
    remainingDays:
      payload.expiresAt == null
        ? null
        : Math.ceil((Date.parse(payload.expiresAt) - Date.now()) / (24 * 60 * 60 * 1000))
  })
}

export async function handleAdminUpload(request: Request, env: Env): Promise<Response> {
  const denied = await requireAdmin(request, env)
  if (denied) return denied
  if (request.method !== 'PUT') return error(405, 'Method Not Allowed')
  if (!env.WECHAT_QR_BUCKET) return error(500, '存储尚未配置')

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return error(400, '请使用 multipart/form-data 上传')
  }

  const file = form.get('file')
  if (!(file instanceof File)) {
    return error(400, '请选择二维码图片')
  }

  if (file.size <= 0 || file.size > MAX_BYTES) {
    return error(400, '图片大小需在 2MB 以内')
  }

  const buffer = new Uint8Array(await file.arrayBuffer())
  const detectedType = detectImageType(buffer)
  if (!detectedType || !ALLOWED_TYPES.has(detectedType)) {
    return error(400, '仅支持 JPG / PNG / WebP 图片')
  }

  const expiresAt = parseExpiresAt(form.get('expiresAt'))
  if (!expiresAt) {
    return error(400, '过期时间格式无效')
  }

  const updatedAt = new Date().toISOString()
  const etag = await crypto.subtle.digest('SHA-256', buffer)
  const etagHex = [...new Uint8Array(etag)].map((b) => b.toString(16).padStart(2, '0')).join('')

  await env.WECHAT_QR_BUCKET.put(IMAGE_KEY, buffer, {
    httpMetadata: { contentType: detectedType },
    customMetadata: { updatedAt, expiresAt }
  })

  const meta: QrMeta = {
    updatedAt,
    expiresAt,
    contentType: detectedType,
    bytes: buffer.byteLength,
    etag: etagHex
  }
  await writeMeta(env, meta)

  await recordAdminAudit(env.CONTENT_DB, request, {
    action: 'wechat_qr.upload',
    resourceType: 'wechat_qr',
    resourceId: IMAGE_KEY,
    status: 'success',
    details: {
      bytes: meta.bytes,
      contentType: meta.contentType,
      expiresAt: meta.expiresAt
    }
  })

  return json({
    ok: true,
    ...publicPayload(meta)
  })
}
