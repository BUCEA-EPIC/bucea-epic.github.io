import { reactive, ref } from 'vue'
import { apiUrl } from '../lib/api.js'
import { cloneContent, mergeContent } from '../data/contentDefaults.js'

const content = reactive(cloneContent())
const loading = ref(false)
const error = ref('')
let loaded = false
let loadingPromise = null

async function loadSiteContent(force = false) {
  if (loadingPromise) return loadingPromise
  if (loaded && !force) return content

  loading.value = true
  error.value = ''
  loadingPromise = fetch(apiUrl('/api/content'), {
    headers: { Accept: 'application/json' }
  })
    .then(async (response) => {
      if (!response.ok) throw new Error(`加载站点配置失败（${response.status}）`)
      const body = await response.json()
      Object.assign(content, mergeContent(body.content))
      loaded = true
      return content
    })
    .catch((cause) => {
      error.value = cause instanceof Error ? cause.message : '加载站点配置失败'
      Object.assign(content, cloneContent())
      loaded = true
      return content
    })
    .finally(() => {
      loading.value = false
      loadingPromise = null
    })

  return loadingPromise
}

export function useSiteContent() {
  return {
    content,
    loading,
    error,
    load: loadSiteContent,
    reload: () => loadSiteContent(true)
  }
}
