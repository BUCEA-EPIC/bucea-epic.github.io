import { requireAdmin } from '../lib/auth'
import { recordAdminAudit } from '../lib/audit'
import { error, json, publicCors } from '../lib/http'
import {
  CONTENT_TYPES,
  ContentConflictError,
  ContentStorageError,
  MAX_CONTENT_BYTES,
  contentBytes,
  isContentType,
  readContent,
  saveContent
} from '../lib/content'

function methodNotAllowed(): Response {
  return error(405, 'Method Not Allowed')
}

async function readJson(request: Request): Promise<unknown> {
  const raw = await request.text()
  if (new TextEncoder().encode(raw).byteLength > MAX_CONTENT_BYTES) {
    throw new Error('内容配置过大')
  }
  try {
    return JSON.parse(raw)
  } catch {
    throw new Error('请求 JSON 格式无效')
  }
}

function contentResponse(snapshot: Awaited<ReturnType<typeof readContent>>): Response {
  return json({
    content: snapshot.content,
    meta: snapshot.meta,
    supportedTypes: CONTENT_TYPES
  })
}

export async function handlePublicContent(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return publicCors(new Response(null, { status: 204 }))
  }
  if (request.method !== 'GET') return publicCors(methodNotAllowed())

  const snapshot = await readContent(env.CONTENT_DB)
  return publicCors(contentResponse(snapshot))
}

export async function handleAdminContent(request: Request, env: Env): Promise<Response> {
  const denied = await requireAdmin(request, env)
  if (denied) return denied
  if (request.method !== 'GET') return methodNotAllowed()

  return contentResponse(await readContent(env.CONTENT_DB))
}

export async function handleAdminContentUpdate(
  request: Request,
  env: Env,
  type: string
): Promise<Response> {
  const denied = await requireAdmin(request, env)
  if (denied) return denied
  if (request.method !== 'PUT') return methodNotAllowed()
  if (!isContentType(type)) return error(404, '未知内容类型')

  let body: { content?: unknown; expectedVersion?: unknown }
  try {
    body = (await readJson(request)) as { content?: unknown; expectedVersion?: unknown }
  } catch (cause) {
    return error(400, cause instanceof Error ? cause.message : '请求格式无效')
  }

  if (!('content' in body)) return error(400, '缺少 content 字段')
  if (contentBytes(body.content) > MAX_CONTENT_BYTES) return error(400, '内容配置过大')

  const expectedVersion =
    body.expectedVersion === null || body.expectedVersion === undefined
      ? null
      : Number(body.expectedVersion)
  if (expectedVersion !== null && (!Number.isInteger(expectedVersion) || expectedVersion < 1)) {
    return error(400, 'expectedVersion 无效')
  }

  try {
    const result = await saveContent(env.CONTENT_DB, type, body.content, expectedVersion)
    await recordAdminAudit(env.CONTENT_DB, request, {
      action: 'content.update',
      resourceType: 'content',
      resourceId: type,
      status: 'success',
      details: { version: result.meta.version }
    })
    return json({ ok: true, type, content: result.payload, meta: result.meta })
  } catch (error) {
    const status = error instanceof ContentConflictError
      ? 409
      : error instanceof ContentStorageError
        ? 503
        : 400
    const message = error instanceof Error ? error.message : '内容保存失败'
    await recordAdminAudit(env.CONTENT_DB, request, {
      action: 'content.update',
      resourceType: 'content',
      resourceId: type,
      status: 'failure',
      details: { status, message }
    })
    return errorResponse(status, message)
  }
}

function errorResponse(status: number, message: string): Response {
  return error(status, message)
}
