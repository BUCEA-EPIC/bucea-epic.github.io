function applySecurityHeaders(headers: Headers): void {
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('X-Frame-Options', 'DENY')
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  headers.set('Content-Security-Policy', "default-src 'none'; base-uri 'none'; frame-ancestors 'none'")
  headers.set('Referrer-Policy', 'no-referrer')
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
}

export function json(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json; charset=utf-8')
  }
  headers.set('Cache-Control', 'no-store')
  headers.set('Pragma', 'no-cache')
  applySecurityHeaders(headers)
  return new Response(JSON.stringify(data), { ...init, headers })
}

export function error(
  status: number,
  message: string,
  extra: Record<string, unknown> = {}
): Response {
  return json({ error: message, ...extra }, { status })
}

export function publicCors(response: Response): Response {
  const headers = new Headers(response.headers)
  applySecurityHeaders(headers)
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Accept, Content-Type')
  headers.set('Access-Control-Max-Age', '86400')
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  })
}

export function methodNotAllowed(allow: string): Response {
  return json(
    { error: 'Method Not Allowed' },
    { status: 405, headers: { Allow: allow } }
  )
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    'unknown'
  )
}
