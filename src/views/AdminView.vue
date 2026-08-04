<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { apiUrl, CONTACT_EMAIL } from '../data/siteInfo.js'
import {
  defaultExpiresDateInput,
  formatDateTime,
  statusLabel
} from '../composables/useWechatQr.js'

const password = ref('')
const loginError = ref('')
const loginLoading = ref(false)
const authenticated = ref(false)
const checkingSession = ref(true)

const meta = ref(null)
const metaError = ref('')
const metaLoading = ref(false)

const file = ref(null)
const previewUrl = ref('')
const expiresDate = ref(defaultExpiresDateInput())
const uploadError = ref('')
const uploadSuccess = ref('')
const uploading = ref(false)

const status = computed(() => meta.value?.status || 'missing')
const imageSrc = computed(() => {
  if (!meta.value?.available || !meta.value?.imageUrl) return ''
  const base = meta.value.imageUrl.startsWith('http')
    ? meta.value.imageUrl
    : apiUrl(meta.value.imageUrl)
  return meta.value.updatedAt
    ? `${base}${base.includes('?') ? '&' : '?'}v=${encodeURIComponent(meta.value.updatedAt)}`
    : base
})

watch(file, (next, prev) => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = next ? URL.createObjectURL(next) : ''
  if (prev && !next) uploadError.value = ''
})

async function refreshMeta() {
  metaLoading.value = true
  metaError.value = ''
  try {
    const response = await fetch(apiUrl('/api/admin/wechat-qr'), {
      credentials: 'include',
      headers: { Accept: 'application/json' }
    })
    if (response.status === 401) {
      authenticated.value = false
      meta.value = null
      return
    }
    if (!response.ok) {
      throw new Error(`读取状态失败（${response.status}）`)
    }
    meta.value = await response.json()
    authenticated.value = true
  } catch (err) {
    metaError.value = err instanceof Error ? err.message : '读取状态失败'
  } finally {
    metaLoading.value = false
    checkingSession.value = false
  }
}

async function handleLogin() {
  loginLoading.value = true
  loginError.value = ''
  try {
    const response = await fetch(apiUrl('/api/admin/login'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ password: password.value })
    })
    const body = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(body.error || '登录失败')
    }
    password.value = ''
    authenticated.value = true
    await refreshMeta()
  } catch (err) {
    loginError.value = err instanceof Error ? err.message : '登录失败'
  } finally {
    loginLoading.value = false
  }
}

async function handleLogout() {
  await fetch(apiUrl('/api/admin/logout'), {
    method: 'POST',
    credentials: 'include'
  })
  authenticated.value = false
  meta.value = null
  file.value = null
  uploadSuccess.value = ''
  uploadError.value = ''
}

function onFileChange(event) {
  const selected = event.target.files?.[0] || null
  uploadSuccess.value = ''
  uploadError.value = ''
  if (!selected) {
    file.value = null
    return
  }
  if (selected.size > 2 * 1024 * 1024) {
    uploadError.value = '图片需小于 2MB'
    file.value = null
    event.target.value = ''
    return
  }
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) {
    uploadError.value = '仅支持 JPG / PNG / WebP'
    file.value = null
    event.target.value = ''
    return
  }
  file.value = selected
}

async function handleUpload() {
  uploadError.value = ''
  uploadSuccess.value = ''
  if (!file.value) {
    uploadError.value = '请先选择二维码图片'
    return
  }
  if (!expiresDate.value) {
    uploadError.value = '请设置过期日期'
    return
  }

  uploading.value = true
  try {
    const form = new FormData()
    form.append('file', file.value)
    // 按所选日期当天 23:59:59 本地时间计为过期点
    const expiresAt = new Date(`${expiresDate.value}T23:59:59`).toISOString()
    form.append('expiresAt', expiresAt)

    const response = await fetch(apiUrl('/api/admin/wechat-qr'), {
      method: 'PUT',
      credentials: 'include',
      body: form
    })
    const body = await response.json().catch(() => ({}))
    if (response.status === 401) {
      authenticated.value = false
      throw new Error('会话已过期，请重新登录')
    }
    if (!response.ok) {
      throw new Error(body.error || '上传失败')
    }

    uploadSuccess.value = '已发布，联系页将展示最新二维码'
    file.value = null
    expiresDate.value = defaultExpiresDateInput()
    await refreshMeta()
  } catch (err) {
    uploadError.value = err instanceof Error ? err.message : '上传失败'
  } finally {
    uploading.value = false
  }
}

onMounted(refreshMeta)
</script>

<template>
  <div class="admin-page">
    <header class="admin-header">
      <div>
        <span class="eyebrow">ADMIN</span>
        <h1>微信招新群二维码</h1>
        <p>运营上传入口。请勿在公开渠道分享本页地址。</p>
      </div>
      <button
        v-if="authenticated"
        type="button"
        class="ghost-btn"
        @click="handleLogout"
      >
        退出登录
      </button>
    </header>

    <div v-if="checkingSession" class="panel muted-panel">
      正在检查登录状态…
    </div>

    <section v-else-if="!authenticated" class="panel login-panel">
      <h2>管理员登录</h2>
      <p class="hint">使用运营共享口令登录。口令由站点维护者通过 Cloudflare Secret 配置。</p>
      <form class="login-form" @submit.prevent="handleLogin">
        <label class="field">
          <span>口令</span>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            placeholder="输入管理口令"
          >
        </label>
        <p v-if="loginError" class="message error">{{ loginError }}</p>
        <button type="submit" class="primary-btn" :disabled="loginLoading">
          {{ loginLoading ? '登录中…' : '登录' }}
        </button>
      </form>
    </section>

    <template v-else>
      <div class="admin-grid">
        <section class="panel">
          <div class="panel-head">
            <h2>当前状态</h2>
            <span class="status-pill" :data-status="status">{{ statusLabel(status) }}</span>
          </div>

          <p v-if="metaLoading" class="hint">刷新中…</p>
          <p v-else-if="metaError" class="message error">{{ metaError }}</p>

          <div v-else class="current-block">
            <div class="preview-frame">
              <img
                v-if="imageSrc"
                :src="imageSrc"
                alt="当前微信招新群二维码"
                class="preview-image"
              >
              <div v-else class="preview-empty">尚未上传二维码</div>
            </div>
            <dl class="meta-list">
              <div>
                <dt>更新时间</dt>
                <dd>{{ formatDateTime(meta?.updatedAt) }}</dd>
              </div>
              <div>
                <dt>过期时间</dt>
                <dd>{{ formatDateTime(meta?.expiresAt) }}</dd>
              </div>
              <div>
                <dt>剩余天数</dt>
                <dd>
                  {{
                    meta?.remainingDays == null
                      ? '—'
                      : meta.remainingDays < 0
                        ? `已过期 ${Math.abs(meta.remainingDays)} 天`
                        : `${meta.remainingDays} 天`
                  }}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>发布新二维码</h2>
          </div>
          <p class="hint">
            微信群二维码通常约 7 天失效。上传后会立即替换联系页展示，无需重新部署网站。
          </p>

          <form class="upload-form" @submit.prevent="handleUpload">
            <label class="field">
              <span>二维码图片</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                @change="onFileChange"
              >
            </label>

            <div class="preview-frame small">
              <img
                v-if="previewUrl"
                :src="previewUrl"
                alt="待发布二维码预览"
                class="preview-image"
              >
              <div v-else class="preview-empty">选择图片后在此预览</div>
            </div>

            <label class="field">
              <span>过期日期</span>
              <input v-model="expiresDate" type="date" required>
            </label>

            <p v-if="uploadError" class="message error">{{ uploadError }}</p>
            <p v-if="uploadSuccess" class="message success">{{ uploadSuccess }}</p>

            <button type="submit" class="primary-btn" :disabled="uploading">
              {{ uploading ? '发布中…' : '发布替换' }}
            </button>
          </form>
        </section>
      </div>

      <section class="panel sop-panel">
        <h2>运营步骤</h2>
        <ol>
          <li>在微信中获取最新招新群二维码（注意约 7 天有效）</li>
          <li>在本页上传图片，确认过期日期约为 +7 天</li>
          <li>打开 <router-link to="/contact">联系我们</router-link>，用手机微信扫码验证</li>
          <li>建议在日历设置第 6 天提醒，避免群码失效无人更换</li>
          <li>如遇问题，邮件联系 <a :href="`mailto:${CONTACT_EMAIL}`">{{ CONTACT_EMAIL }}</a></li>
        </ol>
      </section>
    </template>
  </div>
</template>

<style scoped>
.admin-page {
  max-width: 1040px;
  margin: 0 auto;
  padding: 28px var(--page-gutter) 72px;
}

.admin-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}

.eyebrow {
  display: block;
  margin-bottom: 10px;
  color: var(--color-accent);
  font-size: 0.74rem;
  font-weight: 590;
  letter-spacing: 0.12em;
}

.admin-header h1,
.panel h2 {
  margin: 0;
  color: var(--color-text);
  font-weight: 510;
}

.admin-header h1 {
  font-size: 2rem;
  line-height: 1.15;
}

.admin-header p,
.hint {
  margin: 10px 0 0;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.panel {
  padding: 28px;
  background: var(--color-card);
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-panel);
  box-shadow: var(--shadow-card);
}

.muted-panel {
  color: var(--color-text-secondary);
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid var(--border-standard);
  border-radius: 999px;
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  font-weight: 510;
}

.status-pill[data-status='valid'] {
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.35);
}

.status-pill[data-status='expiring'] {
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.35);
}

.status-pill[data-status='expired'] {
  color: #f87171;
  border-color: rgba(248, 113, 113, 0.35);
}

.current-block,
.upload-form,
.login-form {
  display: grid;
  gap: 16px;
}

.preview-frame {
  display: flex;
  align-items: center;
  justify-content: center;
  width: min(100%, 280px);
  aspect-ratio: 1;
  margin: 0 auto;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  background: var(--color-bg-deep);
  overflow: hidden;
}

.preview-frame.small {
  width: min(100%, 220px);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #fff;
}

.preview-empty {
  padding: 16px;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  text-align: center;
}

.meta-list {
  display: grid;
  gap: 10px;
  margin: 0;
}

.meta-list div {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid var(--border-standard);
}

.meta-list dt {
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.meta-list dd {
  margin: 0;
  color: var(--color-text);
}

.field {
  display: grid;
  gap: 8px;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.field input[type='password'],
.field input[type='date'],
.field input[type='file'] {
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  background: var(--color-bg-deep);
  color: var(--color-text);
}

.field input[type='file'] {
  padding: 10px;
}

.primary-btn,
.ghost-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 16px;
  border-radius: var(--radius-control);
  font-weight: 510;
  cursor: pointer;
}

.primary-btn {
  border: 1px solid transparent;
  background: var(--color-accent);
  color: #fff;
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ghost-btn {
  border: 1px solid var(--border-standard);
  background: transparent;
  color: var(--color-text-secondary);
}

.message {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.6;
}

.message.error {
  color: #f87171;
}

.message.success {
  color: #10b981;
}

.sop-panel {
  margin-top: 18px;
}

.sop-panel ol {
  margin: 12px 0 0;
  padding-left: 1.2em;
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.sop-panel a {
  color: var(--color-accent-hover);
}

@media (max-width: 860px) {
  .admin-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .admin-header {
    flex-direction: column;
  }
}
</style>
