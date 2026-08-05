<script setup>
import { onMounted, ref } from 'vue'
import { apiUrl } from '../lib/api.js'

const emit = defineEmits(['session-expired'])

const logs = ref([])
const loading = ref(true)
const error = ref('')

const actionLabels = {
  'auth.login': '管理员登录',
  'auth.login.rate_limited': '登录限流',
  'auth.login.bootstrap.failure': '管理员口令初始化失败',
  'auth.logout': '管理员退出',
  'auth.password.change': '历史后台口令修改（已停用）',
  'auth.password.recovery.deployment': '生产环境恢复共享口令',
  // Retain explicit labels for historical records created before the recovery
  // flow was moved out of the public admin page.
  'auth.password.recovery': '历史恢复操作（已停用）',
  'auth.password.recovery.rate_limited': '历史恢复限流（已停用）',
  'audit.read': '查看操作记录',
  'content.update': '更新内容',
  'wechat_qr.upload': '上传微信群二维码'
}

function actionLabel(action) {
  return actionLabels[action] || action
}

function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('zh-CN', { hour12: false })
}

function formatDetails(details) {
  if (!details || typeof details !== 'object') return ''
  return Object.entries(details)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(' · ')
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(apiUrl('/api/admin/audit-logs?limit=50'), {
      credentials: 'include',
      headers: { Accept: 'application/json' }
    })
    if (response.status === 401) {
      emit('session-expired')
      return
    }
    const body = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(body.error || `读取审计记录失败（${response.status}）`)
    logs.value = body.logs || []
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '读取审计记录失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section class="panel audit-panel">
    <div class="panel-head">
      <div>
        <h2>管理员操作记录</h2>
        <p class="hint">记录登录、退出、内容发布和二维码更新，不记录口令或密钥内容；生产环境恢复会记录 GitHub 操作者与运行编号。</p>
      </div>
      <button type="button" class="ghost-btn" :disabled="loading" @click="load">
        {{ loading ? '刷新中…' : '刷新' }}
      </button>
    </div>

    <p v-if="error" class="message error">{{ error }}</p>
    <p v-else-if="loading" class="hint">正在读取记录…</p>
    <p v-else-if="!logs.length" class="hint">暂无管理员操作记录。</p>
    <div v-else class="audit-list">
      <article v-for="log in logs" :key="log.id" class="audit-item">
        <div class="audit-item-head">
          <strong>{{ actionLabel(log.action) }}</strong>
          <span class="audit-status" :data-status="log.status">
            {{ log.status === 'success' ? '成功' : '失败' }}
          </span>
        </div>
        <p>{{ formatDateTime(log.createdAt) }} · IP {{ log.ipAddress || '未知' }}</p>
        <p v-if="formatDetails(log.details)" class="audit-details">{{ formatDetails(log.details) }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.audit-panel {
  margin-top: 18px;
}

.audit-panel .panel-head > div {
  min-width: 0;
}

.audit-list {
  display: grid;
  gap: 0;
  margin-top: 18px;
  border-top: 1px solid var(--border-standard);
}

.audit-item {
  padding: 14px 0;
  border-bottom: 1px solid var(--border-standard);
}

.audit-item-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.audit-item strong {
  color: var(--color-text);
  font-weight: 510;
}

.audit-item p {
  margin: 6px 0 0;
  color: var(--color-text-muted);
  font-size: 0.84rem;
}

.audit-details {
  color: var(--color-text-secondary) !important;
}

.audit-status {
  color: #f87171;
  font-size: 0.8rem;
}

.audit-status[data-status='success'] {
  color: #10b981;
}
</style>
