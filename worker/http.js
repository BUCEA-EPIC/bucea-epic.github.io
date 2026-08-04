export function json(data, init = {}) {
  const headers = new Headers(init.headers || {})
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json; charset=utf-8')
  }
  return new Response(JSON.stringify(data), { ...init, headers })
}

export function error(status, message, extra = {}) {
  return json({ error: message, ...extra }, { status })
}

export function publicCors(response) {
  const headers = new Headers(response.headers)
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  headers.set('Access-Control-Max-Age', '86400')
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  })
}

export function getClientIp(request) {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    'unknown'
  )
}
