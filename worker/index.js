import { handleLogin, handleLogout } from './auth.js'
import { error } from './http.js'
import {
  handleAdminMeta,
  handleAdminUpload,
  handlePublicImage,
  handlePublicMeta
} from './wechat-qr.js'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const { pathname } = url

    try {
      if (pathname === '/api/wechat-qr') {
        return await handlePublicMeta(request, env)
      }

      if (pathname === '/api/wechat-qr/image') {
        return await handlePublicImage(request, env)
      }

      if (pathname === '/api/admin/login' && request.method === 'POST') {
        return await handleLogin(request, env)
      }

      if (pathname === '/api/admin/logout' && request.method === 'POST') {
        return await handleLogout(request)
      }

      if (pathname === '/api/admin/wechat-qr' && request.method === 'GET') {
        return await handleAdminMeta(request, env)
      }

      if (pathname === '/api/admin/wechat-qr' && request.method === 'PUT') {
        return await handleAdminUpload(request, env)
      }

      if (pathname.startsWith('/api/')) {
        return error(404, 'Not Found')
      }

      // run_worker_first 仅匹配 /api/* 时通常不会走到这里
      return error(404, 'Not Found')
    } catch (err) {
      console.error(err)
      return error(500, '服务器错误')
    }
  }
}
