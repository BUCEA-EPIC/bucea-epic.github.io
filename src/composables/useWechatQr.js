import { computed, onMounted, ref } from 'vue'
import { apiUrl } from '../data/siteInfo.js'

function withCacheBust(imageUrl, updatedAt) {
  if (!imageUrl) return null
  const absolute = imageUrl.startsWith('http') ? imageUrl : apiUrl(imageUrl)
  if (!updatedAt) return absolute
  const version = encodeURIComponent(updatedAt)
  return absolute.includes('?') ? `${absolute}&v=${version}` : `${absolute}?v=${version}`
}

export function useWechatQr({ autoLoad = true } = {}) {
  const loading = ref(false)
  const error = ref('')
  const data = ref(null)

  const status = computed(() => data.value?.status || 'missing')
  const available = computed(() => Boolean(data.value?.available))
  const imageSrc = computed(() =>
    withCacheBust(data.value?.imageUrl, data.value?.updatedAt)
  )
  const updatedAt = computed(() => data.value?.updatedAt || null)
  const expiresAt = computed(() => data.value?.expiresAt || null)

  async function load() {
    loading.value = true
    error.value = ''
    try {
      const response = await fetch(apiUrl('/api/wechat-qr'), {
        headers: { Accept: 'application/json' }
      })
      if (!response.ok) {
        throw new Error(`加载失败（${response.status}）`)
      }
      data.value = await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载失败'
      data.value = null
    } finally {
      loading.value = false
    }
  }

  if (autoLoad) {
    onMounted(load)
  }

  return {
    loading,
    error,
    data,
    status,
    available,
    imageSrc,
    updatedAt,
    expiresAt,
    load
  }
}

export function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date)
}

export function formatDateInputValue(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function defaultExpiresDateInput() {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return formatDateInputValue(date)
}

export function statusLabel(status) {
  switch (status) {
    case 'valid':
      return '有效'
    case 'expiring':
      return '即将过期'
    case 'expired':
      return '可能已失效'
    default:
      return '未上传'
  }
}
