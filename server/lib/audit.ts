import { getClientIp } from './http'

type AuditStatus = 'success' | 'failure'

export type AdminAuditInput = {
  action: string
  resourceType?: string
  resourceId?: string
  status: AuditStatus
  details?: Record<string, unknown>
}

export async function recordAdminAudit(
  db: D1Database | undefined,
  request: Request,
  input: AdminAuditInput
): Promise<void> {
  if (!db) return

  const detailsJson = input.details
    ? JSON.stringify(input.details).slice(0, 4000)
    : null
  const userAgent = (request.headers.get('User-Agent') || '').slice(0, 300) || null

  try {
    await db
      .prepare(
        `INSERT INTO admin_audit_logs
          (action, resource_type, resource_id, status, ip_address, user_agent, details_json, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        input.action,
        input.resourceType || null,
        input.resourceId || null,
        input.status,
        getClientIp(request).slice(0, 128),
        userAgent,
        detailsJson,
        new Date().toISOString()
      )
      .run()
  } catch (cause) {
    // Audit failure must never expose secrets or break the public site, but it
    // remains visible in Worker logs for operational investigation.
    console.error('Failed to write admin audit event', cause)
  }
}
