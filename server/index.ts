import {
  handleChangePassword,
  handleAuditLogs,
  handleLogin,
  handleLogout
} from './lib/auth'
import { error, methodNotAllowed } from './lib/http'
import {
  handleAdminContent,
  handleAdminContentUpdate,
  handlePublicContent
} from './routes/content'
import {
  handleAdminMeta,
  handleAdminUpload,
  handlePublicImage,
  handlePublicMeta
} from './routes/wechat-qr'

/**
 * Cloudflare Worker entry for the Vue SPA + /api backend.
 *
 * Static assets are served by Workers Assets (`not_found_handling: single-page-application`).
 * Only `/api/*` is forced through this Worker via `assets.run_worker_first`.
 */
export default {
  async fetch(request, env): Promise<Response> {
    const { pathname } = new URL(request.url)

    try {
      switch (pathname) {
        case '/api/content':
          return await handlePublicContent(request, env)
        case '/api/wechat-qr':
          return await handlePublicMeta(request, env)
        case '/api/wechat-qr/image':
          return await handlePublicImage(request, env)
        case '/api/admin/login':
          if (request.method === 'POST') return await handleLogin(request, env)
          return methodNotAllowed('POST')
        case '/api/admin/password':
          return await handleChangePassword(request, env)
        case '/api/admin/audit-logs':
          return await handleAuditLogs(request, env)
        case '/api/admin/logout':
          if (request.method === 'POST') return await handleLogout(request, env)
          return methodNotAllowed('POST')
        case '/api/admin/wechat-qr':
          if (request.method === 'GET') return await handleAdminMeta(request, env)
          if (request.method === 'PUT') return await handleAdminUpload(request, env)
          return methodNotAllowed('GET, PUT')
        default:
          if (pathname.startsWith('/api/admin/content/')) {
            const type = pathname.slice('/api/admin/content/'.length)
            return await handleAdminContentUpdate(request, env, type)
          }
          if (pathname === '/api/admin/content') {
            return await handleAdminContent(request, env)
          }
          break
      }

      if (pathname.startsWith('/api/')) {
        return error(404, 'Not Found')
      }

      // Non-API traffic should normally not reach the Worker.
      return error(404, 'Not Found')
    } catch (err) {
      console.error(err)
      return error(500, '服务器错误')
    }
  }
} satisfies ExportedHandler<Env>
