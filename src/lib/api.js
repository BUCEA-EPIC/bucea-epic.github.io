// Client helpers for talking to the Cloudflare Worker `/api` routes.
// Same-origin on Workers deploy; static mirrors can set VITE_API_BASE.

/** @type {string} */
export const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '')

/**
 * @param {string} path
 * @returns {string}
 */
export function apiUrl(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE}${normalized}`
}
