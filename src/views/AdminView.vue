<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import AdminAuditLog from '../components/AdminAuditLog.vue'
import AdminContentEditor from '../components/AdminContentEditor.vue'
import AdminSidebar from '../components/AdminSidebar.vue'
import { useSiteContent } from '../composables/useSiteContent.js'
import { apiUrl } from '../lib/api.js'
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
const recoveryWorkflowUrl = 'https://github.com/BUCEA-EPIC/bucea-epic.github.io/actions/workflows/reset-admin-password.yml'
const productionEnvironmentUrl = 'https://github.com/BUCEA-EPIC/bucea-epic.github.io/settings/environments/production'
const activeSection = ref('overview')

const adminSectionDefinitions = [
  {
    key: 'overview',
    eyebrow: 'OVERVIEW',
    title: '工作台总览',
    description: '查看当前发布状态，并从这里进入各项管理功能。'
  },
  {
    key: 'content',
    eyebrow: 'CONTENT',
    title: '内容管理',
    description: '维护站点信息、团队、项目、资源和新闻等公开内容。'
  },
  {
    key: 'operations',
    eyebrow: 'OPERATIONS',
    title: '运营资源',
    description: '管理联系页展示的微信招新群二维码等运营资源。'
  },
  {
    key: 'audit',
    eyebrow: 'AUDIT',
    title: '操作记录',
    description: '查看管理员登录、内容发布和运营资源更新记录。'
  },
  {
    key: 'security',
    eyebrow: 'SECURITY',
    title: '访问与安全',
    description: '查看管理员口令的生产环境配置、恢复和权限说明。'
  }
]

const meta = ref(null)
const metaError = ref('')
const metaLoading = ref(false)

const file = ref(null)
const previewUrl = ref('')
const expiresDate = ref(defaultExpiresDateInput())
const uploadError = ref('')
const uploadSuccess = ref('')
const uploading = ref(false)
const { content: siteContent } = useSiteContent()

const status = computed(() => meta.value?.status || 'missing')
const activeSectionDefinition = computed(() =>
  adminSectionDefinitions.find((item) => item.key === activeSection.value) || adminSectionDefinitions[0]
)
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

function handleContentSessionExpired() {
  authenticated.value = false
  meta.value = null
}

function setActiveSection(section) {
  if (adminSectionDefinitions.some((item) => item.key === section)) {
    activeSection.value = section
  }
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
    <header v-if="checkingSession || !authenticated" class="admin-header">
      <div>
        <span class="eyebrow">ADMIN CONSOLE</span>
        <h1>管理员后台</h1>
        <p>统一管理站点内容、运营资源与管理员操作记录。请勿在公开渠道分享本页地址。</p>
      </div>
    </header>

    <div v-if="checkingSession" class="panel muted-panel">
      正在检查登录状态…
    </div>

    <section v-else-if="!authenticated" class="panel login-panel">
      <h2>管理员登录</h2>
      <p class="hint">多人共用管理员口令。登录后可管理站点内容、运营资源和操作记录；口令不在本页面修改。</p>
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
      <p class="recovery-help">
        管理员口令统一配置在 GitHub 的
        <a :href="productionEnvironmentUrl" target="_blank" rel="noreferrer">production Environment</a>
        中的 <code>ADMIN_PASSWORD</code>。更新后运行
        <a :href="recoveryWorkflowUrl" target="_blank" rel="noreferrer">管理员口令恢复工作流</a>。
      </p>
    </section>

    <template v-else>
      <div class="admin-console">
        <AdminSidebar
          :active-section="activeSection"
          @update:active-section="setActiveSection"
        />

        <main class="admin-main">
          <header class="admin-workspace-header">
            <div>
              <span class="eyebrow">{{ activeSectionDefinition.eyebrow }}</span>
              <h1>{{ activeSectionDefinition.title }}</h1>
              <p>{{ activeSectionDefinition.description }}</p>
            </div>
            <div class="admin-workspace-actions">
              <span class="session-status">已登录</span>
              <button type="button" class="ghost-btn" @click="handleLogout">退出登录</button>
            </div>
          </header>

          <section v-if="activeSection === 'overview'" class="admin-section">
            <div class="overview-grid">
              <section class="panel overview-status-card">
                <div class="panel-head">
                  <div>
                    <span class="card-kicker">运营资源</span>
                    <h2>微信招新群二维码</h2>
                  </div>
                  <span class="status-pill" :data-status="status">{{ statusLabel(status) }}</span>
                </div>
                <p v-if="metaLoading" class="hint">刷新中…</p>
                <p v-else-if="metaError" class="message error">{{ metaError }}</p>
                <dl v-else class="overview-meta-list">
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
                <button type="button" class="text-btn overview-link" @click="setActiveSection('operations')">
                  进入运营资源
                  <span aria-hidden="true">→</span>
                </button>
              </section>

              <section class="panel overview-summary-card">
                <div class="panel-head">
                  <div>
                    <span class="card-kicker">内容配置</span>
                    <h2>站点公开内容</h2>
                  </div>
                  <span class="summary-count">5 个栏目</span>
                </div>
                <p class="hint">站点信息、团队成员、项目与机器人、教程与资源、新闻与动态。</p>
                <button type="button" class="text-btn overview-link" @click="setActiveSection('content')">
                  进入内容管理
                  <span aria-hidden="true">→</span>
                </button>
              </section>
            </div>

            <section class="panel quick-actions-panel">
              <div class="panel-head">
                <div>
                  <span class="card-kicker">快捷操作</span>
                  <h2>管理功能</h2>
                </div>
              </div>
              <div class="quick-action-grid">
                <button type="button" class="quick-action" @click="setActiveSection('content')">
                  <strong>编辑站点内容</strong>
                  <span>维护团队、项目、资源和新闻等栏目。</span>
                </button>
                <button type="button" class="quick-action" @click="setActiveSection('operations')">
                  <strong>更新运营资源</strong>
                  <span>替换联系页展示的招新群二维码。</span>
                </button>
                <button type="button" class="quick-action" @click="setActiveSection('audit')">
                  <strong>查看操作记录</strong>
                  <span>核对管理员登录、发布和更新记录。</span>
                </button>
                <button type="button" class="quick-action" @click="setActiveSection('security')">
                  <strong>访问与安全</strong>
                  <span>查看 production Environment 配置说明。</span>
                </button>
              </div>
            </section>
          </section>

          <section v-else-if="activeSection === 'content'" class="admin-section">
            <AdminContentEditor @session-expired="handleContentSessionExpired" />
          </section>

          <section v-else-if="activeSection === 'operations'" class="admin-section">
            <div class="admin-grid">
              <section class="panel">
                <div class="panel-head">
                  <div>
                    <span class="card-kicker">当前资源</span>
                    <h2>二维码状态</h2>
                  </div>
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
                  <div>
                    <span class="card-kicker">发布资源</span>
                    <h2>更新招新群二维码</h2>
                  </div>
                </div>
                <p class="hint">
                  上传后会立即替换联系页展示，无需重新部署网站。请填写实际失效日期。
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

            <section class="panel operation-notes">
              <div class="panel-head">
                <div>
                  <span class="card-kicker">发布规则</span>
                  <h2>资源维护说明</h2>
                </div>
              </div>
              <ul>
                <li>支持 JPG、PNG、WebP 图片，文件大小不超过 2MB。</li>
                <li>微信群二维码通常约 7 天失效，建议提前更新并设置日历提醒。</li>
                <li>发布后打开 <router-link to="/contact">联系我们</router-link>，确认移动端展示和扫码结果。</li>
                <li>如遇问题，邮件联系 <a :href="`mailto:${siteContent.site.contactEmail}`">{{ siteContent.site.contactEmail }}</a>。</li>
              </ul>
            </section>
          </section>

          <section v-else-if="activeSection === 'audit'" class="admin-section">
            <AdminAuditLog @session-expired="handleContentSessionExpired" />
          </section>

          <section v-else-if="activeSection === 'security'" class="admin-section">
            <div class="security-grid">
              <section class="panel">
                <div class="panel-head">
                  <div>
                    <span class="card-kicker">生产配置</span>
                    <h2>管理员口令</h2>
                  </div>
                  <span class="security-badge">Environment secret</span>
                </div>
                <p class="hint">
                  共享管理员口令不在后台页面修改，也不提供邮箱找回。统一通过 GitHub 的 production Environment 管理。
                </p>
                <dl class="security-list">
                  <div>
                    <dt>配置路径</dt>
                    <dd>Settings → Environments → production → Configure production</dd>
                  </div>
                  <div>
                    <dt>配置名称</dt>
                    <dd><code>ADMIN_PASSWORD</code></dd>
                  </div>
                  <div>
                    <dt>同步方式</dt>
                    <dd>更新 Secret 后运行管理员口令恢复工作流</dd>
                  </div>
                </dl>
                <div class="security-actions">
                  <a :href="productionEnvironmentUrl" target="_blank" rel="noreferrer" class="primary-btn">打开 production 配置</a>
                  <a :href="recoveryWorkflowUrl" target="_blank" rel="noreferrer" class="ghost-btn">打开恢复工作流</a>
                </div>
              </section>

              <section class="panel">
                <div class="panel-head">
                  <div>
                    <span class="card-kicker">恢复流程</span>
                    <h2>口令遗忘时</h2>
                  </div>
                </div>
                <ol class="security-steps">
                  <li>由具备 production Environment 权限的维护者更新 <code>ADMIN_PASSWORD</code>。</li>
                  <li>打开恢复工作流，输入 <code>RESET</code> 并运行。</li>
                  <li>工作流更新 D1 哈希、使旧会话失效，并记录审计事件。</li>
                  <li>使用新口令登录后台；不要在 Issue、PR 或聊天中传递口令。</li>
                </ol>
              </section>
            </div>

            <section class="panel security-boundary">
              <div class="panel-head">
                <div>
                  <span class="card-kicker">安全边界</span>
                  <h2>协作规则</h2>
                </div>
              </div>
              <ul>
                <li><code>ADMIN_PASSWORD</code> 和 <code>ADMIN_SESSION_SECRET</code> 只保存在 GitHub production Environment 或受控的本地 Wrangler 配置中。</li>
                <li>管理员操作会记录时间、来源、操作类型和结果，不记录口令或请求正文。</li>
                <li>内容发布采用栏目版本控制；多人同时编辑时，冲突需要刷新后重新确认。</li>
              </ul>
            </section>
          </section>
        </main>
      </div>
    </template>
  </div>
</template>

<style scoped>
.admin-page {
  max-width: 1240px;
  margin: 0 auto;
  padding: 34px var(--page-gutter) 72px;
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

.admin-console {
  display: grid;
  grid-template-columns: 236px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.admin-main {
  min-width: 0;
}

.admin-workspace-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  min-height: 112px;
  margin-bottom: 24px;
  padding: 4px 2px 24px;
  border-bottom: 1px solid var(--border-subtle);
}

.admin-workspace-header h1 {
  margin: 0;
  color: var(--color-text);
  font-size: 2.1rem;
  font-weight: 510;
  line-height: 1.15;
}

.admin-workspace-header p {
  max-width: 660px;
  margin: 10px 0 0;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.admin-workspace-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.session-status,
.security-badge,
.summary-count {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid var(--border-standard);
  border-radius: 999px;
  color: var(--color-text-muted);
  font-size: 0.78rem;
  white-space: nowrap;
}

.session-status::before {
  width: 6px;
  height: 6px;
  margin-right: 7px;
  border-radius: 50%;
  background: #10b981;
  content: '';
}

.security-badge {
  color: var(--color-accent-hover);
  border-color: rgba(141, 152, 216, 0.35);
  background: rgba(141, 152, 216, 0.08);
}

.admin-section {
  display: grid;
  gap: 18px;
  min-width: 0;
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

.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.overview-status-card,
.overview-summary-card,
.quick-actions-panel {
  min-width: 0;
}

.card-kicker {
  display: block;
  margin-bottom: 7px;
  color: var(--color-accent);
  font-size: 0.7rem;
  font-weight: 590;
  letter-spacing: 0.1em;
  line-height: 1.2;
  text-transform: uppercase;
}

.panel-head h2 {
  line-height: 1.25;
}

.overview-meta-list,
.security-list {
  display: grid;
  gap: 0;
  margin: 22px 0 0;
}

.overview-meta-list div,
.security-list div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding: 11px 0;
  border-top: 1px solid var(--border-standard);
}

.overview-meta-list dt,
.security-list dt {
  color: var(--color-text-muted);
  font-size: 0.84rem;
}

.overview-meta-list dd,
.security-list dd {
  margin: 0;
  color: var(--color-text);
  text-align: right;
}

.overview-link {
  margin-top: 18px;
}

.quick-actions-panel {
  margin-top: 0;
}

.quick-action-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.quick-action {
  display: grid;
  gap: 7px;
  min-height: 112px;
  padding: 15px;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  background: var(--color-bg-deep);
  color: var(--color-text-secondary);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}

.quick-action:hover {
  border-color: rgba(141, 152, 216, 0.48);
  background: rgba(141, 152, 216, 0.08);
  transform: translateY(-1px);
}

.quick-action strong {
  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 510;
}

.quick-action span {
  color: var(--color-text-muted);
  font-size: 0.78rem;
  line-height: 1.55;
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

.recovery-help {
  margin: 18px 0 0;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.recovery-help a {
  color: var(--color-accent-hover);
}

.recovery-help code {
  padding: 2px 5px;
  border-radius: 4px;
  background: var(--color-bg-deep);
  color: var(--color-text);
  font-size: 0.9em;
}

.text-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-accent-hover);
  font-size: 0.86rem;
  cursor: pointer;
}

.text-btn:hover {
  color: var(--color-text);
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

.operation-notes ul,
.security-boundary ul {
  margin: 12px 0 0;
  padding-left: 1.2em;
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.operation-notes a,
.security-boundary a {
  color: var(--color-accent-hover);
}

.security-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
  gap: 18px;
}

.security-list code,
.security-steps code,
.security-boundary code {
  padding: 2px 5px;
  border-radius: 4px;
  background: var(--color-bg-deep);
  color: var(--color-text);
  font-size: 0.88em;
}

.security-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}

.security-actions a {
  text-decoration: none;
}

.security-steps {
  margin: 8px 0 0;
  padding-left: 1.25em;
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.security-steps li + li {
  margin-top: 8px;
}

.security-boundary {
  margin-top: 0;
}

@media (max-width: 860px) {
  .admin-console {
    grid-template-columns: minmax(0, 1fr);
  }

  .admin-workspace-header {
    min-height: 0;
  }

  .admin-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .overview-grid,
  .security-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .quick-action-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .admin-header {
    flex-direction: column;
  }
}

@media (max-width: 560px) {
  .admin-page {
    padding-right: max(16px, env(safe-area-inset-right));
    padding-left: max(16px, env(safe-area-inset-left));
  }

  .panel {
    padding: 22px;
  }

  .admin-workspace-header {
    flex-direction: column;
  }

  .admin-workspace-actions {
    width: 100%;
    justify-content: space-between;
  }

  .quick-action-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .overview-meta-list div,
  .security-list div {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .overview-meta-list dd,
  .security-list dd {
    text-align: left;
  }
}
</style>
