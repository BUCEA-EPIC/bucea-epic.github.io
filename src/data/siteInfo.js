// src/data/siteInfo.js
// 站点级常量的唯一事实来源：联系邮箱、仓库地址等变更只需改这里
export const CONTACT_EMAIL = 'contact@rayspace.org'
export const GITHUB_URL = 'https://github.com/BUCEA-EPIC'
export const SITE_LOGO = `${import.meta.env.BASE_URL}logo.jpg`

// 空字符串表示同源 API（Cloudflare 主站）；GitHub Pages 等静态部署可设为 https://rayspace.org
export const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '')

export function apiUrl(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE}${normalized}`
}
