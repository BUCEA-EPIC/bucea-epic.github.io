<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  cloneContent,
  defaultContent,
  mergeContent,
  prepareStoredContent
} from '../data/contentDefaults.js'
import { apiUrl } from '../lib/api.js'

const emit = defineEmits(['session-expired'])

const content = ref(cloneContent())
const meta = ref({})
const activeSection = ref('site')
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const notice = ref('')

const sectionDefinitions = [
  { key: 'site', label: '站点信息', hint: '邮箱、地址、社交链接等全局信息' },
  { key: 'team', label: '团队成员', hint: '指导老师、负责人和成员资料' },
  { key: 'projects', label: '项目与机器人', hint: '项目介绍、标签、图片和链接' },
  { key: 'resources', label: '教程与资源', hint: '资源分类与条目链接' },
  { key: 'news', label: '新闻与动态', hint: '首页和新闻页展示的动态内容' }
]

const activeDefinition = computed(() =>
  sectionDefinitions.find((item) => item.key === activeSection.value)
)

const activeVersion = computed(() => meta.value[activeSection.value]?.version || null)

function setMessage(nextError = '', nextNotice = '') {
  error.value = nextError
  notice.value = nextNotice
}

async function load() {
  loading.value = true
  setMessage()
  try {
    const response = await fetch(apiUrl('/api/admin/content'), {
      credentials: 'include',
      headers: { Accept: 'application/json' }
    })
    if (response.status === 401) {
      emit('session-expired')
      return
    }
    if (!response.ok) throw new Error(`读取内容配置失败（${response.status}）`)
    const body = await response.json()
    content.value = mergeContent(body.content)
    meta.value = body.meta || {}
    if (!Object.keys(body.content || {}).length) {
      notice.value = '当前使用代码内置默认内容，保存栏目后会写入 D1。'
    }
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '读取内容配置失败'
  } finally {
    loading.value = false
  }
}

async function saveSection(sectionKey) {
  saving.value = true
  setMessage()
  try {
    const response = await fetch(apiUrl(`/api/admin/content/${sectionKey}`), {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        content: prepareStoredContent(content.value)[sectionKey],
        expectedVersion: meta.value[sectionKey]?.version ?? null
      })
    })
    const body = await response.json().catch(() => ({}))
    if (response.status === 401) {
      emit('session-expired')
      return
    }
    if (!response.ok) throw new Error(body.error || `保存${sectionKey}失败`)
    content.value[sectionKey] = mergeContent({ [sectionKey]: body.content })[sectionKey]
    meta.value[sectionKey] = body.meta
    notice.value = `${activeDefinition.value?.label || '当前栏目'}已保存，版本 v${body.meta.version}`
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '保存失败'
  } finally {
    saving.value = false
  }
}

async function saveCurrent() {
  await saveSection(activeSection.value)
}

function resetCurrent() {
  if (!window.confirm('仅恢复当前栏目到代码内置默认值，确认继续吗？')) return
  content.value[activeSection.value] = cloneContent(defaultContent[activeSection.value])
  setMessage('', '已恢复本地默认值，请点击保存后才会发布。')
}

function addAdvisor() {
  content.value.team.advisors.push({
    id: `advisor-${Date.now()}`,
    name: '',
    role: '',
    bio: '',
    avatar: ''
  })
}

function addMember() {
  content.value.team.coreTeam.push({
    id: `member-${Date.now()}`,
    name: '',
    role: '',
    bio: '',
    avatar: ''
  })
}

function addProject() {
  content.value.projects.push({
    id: `project-${Date.now()}`,
    title: '',
    description: '',
    image: '',
    tags: [],
    url: ''
  })
}

function addResourceSection() {
  content.value.resources.push({
    id: `resource-section-${Date.now()}`,
    category: '',
    description: '',
    items: []
  })
}

function addResourceItem(section) {
  section.items.push({
    id: `resource-${Date.now()}`,
    title: '',
    subtitle: '',
    description: '',
    url: ''
  })
}

function addNews() {
  content.value.news.unshift({
    id: `news-${Date.now()}`,
    title: '',
    date: new Date().toISOString().slice(0, 10),
    excerpt: '',
    image: ''
  })
}

function removeItem(items, index, label) {
  if (window.confirm(`确认删除${label}吗？保存后才会正式发布。`)) items.splice(index, 1)
}

function moveItem(items, index, offset) {
  const nextIndex = index + offset
  if (nextIndex < 0 || nextIndex >= items.length) return
  const [item] = items.splice(index, 1)
  items.splice(nextIndex, 0, item)
}

function setTags(item, event) {
  item.tags = event.target.value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

onMounted(load)
</script>

<template>
  <section class="content-editor panel">
    <div class="content-editor-header">
      <div>
        <span class="eyebrow">CONTENT</span>
        <h2>站点内容配置</h2>
        <p class="hint">结构化内容保存在 Cloudflare D1，发布后无需重新构建前端。</p>
      </div>
      <div class="editor-actions">
        <button type="button" class="ghost-btn" :disabled="loading || saving" @click="load">
          重新读取
        </button>
        <button type="button" class="primary-btn" :disabled="loading || saving" @click="saveCurrent">
          {{ saving ? '保存中…' : '保存当前栏目' }}
        </button>
      </div>
    </div>

    <p v-if="error" class="message error">{{ error }}</p>
    <p v-if="notice" class="message success">{{ notice }}</p>

    <div v-if="loading" class="editor-loading">正在读取内容配置…</div>

    <template v-else>
      <div class="content-tabs" role="tablist" aria-label="内容栏目">
        <button
          v-for="section in sectionDefinitions"
          :key="section.key"
          type="button"
          class="content-tab"
          :class="{ active: activeSection === section.key }"
          role="tab"
          :aria-selected="activeSection === section.key"
          @click="activeSection = section.key"
        >
          <strong>{{ section.label }}</strong>
          <span>{{ section.hint }}</span>
        </button>
      </div>

      <div class="editor-toolbar">
        <span>当前版本：{{ activeVersion ? `v${activeVersion}` : '尚未发布' }}</span>
        <button type="button" class="text-btn" @click="resetCurrent">恢复代码默认值</button>
      </div>

      <form v-if="activeSection === 'site'" class="editor-form" @submit.prevent="saveCurrent">
        <div class="form-grid two-columns">
          <label class="field">
            <span>联系邮箱</span>
            <input v-model="content.site.contactEmail" type="email" required>
          </label>
          <label class="field">
            <span>GitHub 仓库地址</span>
            <input v-model="content.site.githubUrl" type="url">
          </label>
        </div>
        <label class="field">
          <span>工作室地址</span>
          <textarea v-model="content.site.address" rows="3" required></textarea>
        </label>
        <label class="field">
          <span>联系页说明</span>
          <textarea v-model="content.site.contactIntro" rows="3" required></textarea>
        </label>
        <label class="field">
          <span>微信招新群说明</span>
          <textarea v-model="content.site.wechatIntro" rows="3" required></textarea>
        </label>
      </form>

      <form v-else-if="activeSection === 'team'" class="editor-form" @submit.prevent="saveCurrent">
        <div class="editor-section-heading">
          <div>
            <h3>指导老师</h3>
            <p>可调整展示顺序；头像支持站内路径或公开 HTTPS 地址。</p>
          </div>
          <button type="button" class="ghost-btn" @click="addAdvisor">新增指导老师</button>
        </div>
        <article v-for="(member, index) in content.team.advisors" :key="member.id" class="editor-card">
          <div class="editor-card-heading">
            <strong>{{ member.name || `指导老师 ${index + 1}` }}</strong>
            <div class="inline-actions">
              <button type="button" class="icon-btn" :disabled="index === 0" @click="moveItem(content.team.advisors, index, -1)">↑</button>
              <button type="button" class="icon-btn" :disabled="index === content.team.advisors.length - 1" @click="moveItem(content.team.advisors, index, 1)">↓</button>
              <button type="button" class="danger-btn" @click="removeItem(content.team.advisors, index, '指导老师')">删除</button>
            </div>
          </div>
          <div class="form-grid two-columns">
            <label class="field"><span>姓名</span><input v-model="member.name" required></label>
            <label class="field"><span>职务 / 角色</span><input v-model="member.role"></label>
          </div>
          <label class="field"><span>头像地址</span><input v-model="member.avatar" placeholder="/assets/... 或 https://..."></label>
          <label class="field"><span>简介</span><textarea v-model="member.bio" rows="5"></textarea></label>
        </article>

        <div class="editor-section-heading second">
          <div>
            <h3>核心团队</h3>
            <p>角色填写“主要负责人”时，前台会自动展示为负责人卡片。</p>
          </div>
          <button type="button" class="ghost-btn" @click="addMember">新增成员</button>
        </div>
        <article v-for="(member, index) in content.team.coreTeam" :key="member.id" class="editor-card">
          <div class="editor-card-heading">
            <strong>{{ member.name || `成员 ${index + 1}` }}</strong>
            <div class="inline-actions">
              <button type="button" class="icon-btn" :disabled="index === 0" @click="moveItem(content.team.coreTeam, index, -1)">↑</button>
              <button type="button" class="icon-btn" :disabled="index === content.team.coreTeam.length - 1" @click="moveItem(content.team.coreTeam, index, 1)">↓</button>
              <button type="button" class="danger-btn" @click="removeItem(content.team.coreTeam, index, '团队成员')">删除</button>
            </div>
          </div>
          <div class="form-grid two-columns">
            <label class="field"><span>姓名</span><input v-model="member.name" required></label>
            <label class="field"><span>职务 / 角色</span><input v-model="member.role"></label>
          </div>
          <label class="field"><span>头像地址</span><input v-model="member.avatar" placeholder="/assets/... 或 https://..."></label>
          <label class="field"><span>简介</span><textarea v-model="member.bio" rows="4"></textarea></label>
        </article>
      </form>

      <form v-else-if="activeSection === 'projects'" class="editor-form" @submit.prevent="saveCurrent">
        <div class="editor-section-heading">
          <div><h3>项目列表</h3><p>首页与项目页会按此顺序展示。</p></div>
          <button type="button" class="ghost-btn" @click="addProject">新增项目</button>
        </div>
        <article v-for="(project, index) in content.projects" :key="project.id" class="editor-card">
          <div class="editor-card-heading">
            <strong>{{ project.title || `项目 ${index + 1}` }}</strong>
            <div class="inline-actions">
              <button type="button" class="icon-btn" :disabled="index === 0" @click="moveItem(content.projects, index, -1)">↑</button>
              <button type="button" class="icon-btn" :disabled="index === content.projects.length - 1" @click="moveItem(content.projects, index, 1)">↓</button>
              <button type="button" class="danger-btn" @click="removeItem(content.projects, index, '项目')">删除</button>
            </div>
          </div>
          <label class="field"><span>项目名称</span><input v-model="project.title" required></label>
          <label class="field"><span>项目图片地址</span><input v-model="project.image" placeholder="/assets/... 或 https://..."></label>
          <label class="field"><span>项目链接</span><input v-model="project.url" placeholder="https://... 或留空"></label>
          <label class="field"><span>标签（逗号分隔）</span><input :value="project.tags.join(', ')" @input="setTags(project, $event)"></label>
          <label class="field"><span>项目介绍</span><textarea v-model="project.description" rows="5" required></textarea></label>
        </article>
      </form>

      <form v-else-if="activeSection === 'resources'" class="editor-form" @submit.prevent="saveCurrent">
        <div class="editor-section-heading">
          <div><h3>资源分类</h3><p>每个分类可以包含任意数量的教程或工具链接。</p></div>
          <button type="button" class="ghost-btn" @click="addResourceSection">新增分类</button>
        </div>
        <article v-for="(section, sectionIndex) in content.resources" :key="section.id" class="editor-card">
          <div class="editor-card-heading">
            <strong>{{ section.category || `资源分类 ${sectionIndex + 1}` }}</strong>
            <div class="inline-actions">
              <button type="button" class="icon-btn" :disabled="sectionIndex === 0" @click="moveItem(content.resources, sectionIndex, -1)">↑</button>
              <button type="button" class="icon-btn" :disabled="sectionIndex === content.resources.length - 1" @click="moveItem(content.resources, sectionIndex, 1)">↓</button>
              <button type="button" class="danger-btn" @click="removeItem(content.resources, sectionIndex, '资源分类')">删除</button>
            </div>
          </div>
          <label class="field"><span>分类名称</span><input v-model="section.category" required></label>
          <label class="field"><span>分类说明</span><textarea v-model="section.description" rows="3"></textarea></label>
          <div class="nested-heading">
            <strong>资源条目</strong>
            <button type="button" class="text-btn" @click="addResourceItem(section)">新增条目</button>
          </div>
          <div v-for="(item, itemIndex) in section.items" :key="item.id" class="nested-card">
            <div class="editor-card-heading">
              <strong>{{ item.title || `条目 ${itemIndex + 1}` }}</strong>
              <div class="inline-actions">
                <button type="button" class="icon-btn" :disabled="itemIndex === 0" @click="moveItem(section.items, itemIndex, -1)">↑</button>
                <button type="button" class="icon-btn" :disabled="itemIndex === section.items.length - 1" @click="moveItem(section.items, itemIndex, 1)">↓</button>
                <button type="button" class="danger-btn" @click="removeItem(section.items, itemIndex, '资源条目')">删除</button>
              </div>
            </div>
            <label class="field"><span>标题</span><input v-model="item.title" required></label>
            <label class="field"><span>副标题</span><input v-model="item.subtitle"></label>
            <label class="field"><span>链接</span><input v-model="item.url" required></label>
            <label class="field"><span>说明</span><textarea v-model="item.description" rows="4" required></textarea></label>
          </div>
        </article>
      </form>

      <form v-else class="editor-form" @submit.prevent="saveCurrent">
        <div class="editor-section-heading">
          <div><h3>新闻列表</h3><p>第一条新闻会作为首页最新动态的首项。</p></div>
          <button type="button" class="ghost-btn" @click="addNews">新增新闻</button>
        </div>
        <article v-for="(item, index) in content.news" :key="item.id" class="editor-card">
          <div class="editor-card-heading">
            <strong>{{ item.title || `新闻 ${index + 1}` }}</strong>
            <div class="inline-actions">
              <button type="button" class="icon-btn" :disabled="index === 0" @click="moveItem(content.news, index, -1)">↑</button>
              <button type="button" class="icon-btn" :disabled="index === content.news.length - 1" @click="moveItem(content.news, index, 1)">↓</button>
              <button type="button" class="danger-btn" @click="removeItem(content.news, index, '新闻')">删除</button>
            </div>
          </div>
          <div class="form-grid two-columns">
            <label class="field"><span>标题</span><input v-model="item.title" required></label>
            <label class="field"><span>发布日期</span><input v-model="item.date" required></label>
          </div>
          <label class="field"><span>封面图片地址</span><input v-model="item.image" placeholder="/assets/... 或 https://..."></label>
          <label class="field"><span>摘要</span><textarea v-model="item.excerpt" rows="5" required></textarea></label>
        </article>
      </form>

      <div class="editor-footer">
        <span>保存操作按栏目生成独立版本记录，可防止并发编辑覆盖。</span>
        <button type="button" class="primary-btn" :disabled="saving" @click="saveCurrent">
          {{ saving ? '保存中…' : '保存当前栏目' }}
        </button>
      </div>
    </template>
  </section>
</template>

<style scoped>
.content-editor {
  display: grid;
  gap: 22px;
  margin-top: 18px;
}

.content-editor-header,
.editor-section-heading,
.editor-card-heading,
.editor-toolbar,
.editor-footer,
.nested-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.content-editor-header {
  align-items: flex-start;
}

.content-editor h2,
.content-editor h3 {
  margin: 0;
  color: var(--color-text);
  font-weight: 510;
}

.content-editor h2 { font-size: 1.65rem; }
.content-editor h3 { font-size: 1.15rem; }

.editor-actions,
.inline-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.content-tabs {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
}

.content-tab {
  display: grid;
  gap: 6px;
  min-height: 76px;
  padding: 12px;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  background: var(--color-bg-deep);
  color: var(--color-text-secondary);
  text-align: left;
  cursor: pointer;
}

.content-tab strong { color: var(--color-text); font-size: 0.9rem; }
.content-tab span { color: var(--color-text-muted); font-size: 0.75rem; line-height: 1.45; }
.content-tab.active { border-color: var(--color-accent); background: rgba(255, 255, 255, 0.06); }

.editor-toolbar {
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-standard);
  color: var(--color-text-muted);
  font-size: 0.82rem;
}

.editor-form { display: grid; gap: 18px; }
.form-grid { display: grid; gap: 16px; }
.two-columns { grid-template-columns: repeat(2, minmax(0, 1fr)); }

.field {
  display: grid;
  gap: 7px;
  color: var(--color-text-secondary);
  font-size: 0.86rem;
}

.field input,
.field textarea {
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  background: var(--color-bg-deep);
  color: var(--color-text);
  font: inherit;
}

.field textarea { min-height: 88px; resize: vertical; line-height: 1.6; }
.field input:focus,
.field textarea:focus { outline: 2px solid var(--color-accent); outline-offset: 2px; }

.editor-section-heading { align-items: flex-start; }
.editor-section-heading.second { margin-top: 18px; padding-top: 24px; border-top: 1px solid var(--border-standard); }
.editor-section-heading p { margin: 6px 0 0; color: var(--color-text-muted); font-size: 0.82rem; }

.editor-card,
.nested-card {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  background: rgba(255, 255, 255, 0.025);
}

.nested-card { padding: 14px; background: var(--color-bg-deep); }
.editor-card-heading strong { color: var(--color-text); font-size: 0.95rem; }
.nested-heading { padding-top: 4px; color: var(--color-text-secondary); }

.icon-btn,
.danger-btn,
.text-btn {
  min-height: 32px;
  padding: 5px 9px;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.icon-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.danger-btn { border-color: rgba(248, 113, 113, 0.35); color: #fca5a5; }
.text-btn { border: 0; color: var(--color-accent-hover); }
.icon-btn:hover:not(:disabled), .danger-btn:hover, .text-btn:hover { color: var(--color-text); border-color: var(--border-strong); }

.editor-loading { color: var(--color-text-secondary); }
.editor-footer { padding-top: 12px; border-top: 1px solid var(--border-standard); color: var(--color-text-muted); font-size: 0.8rem; }

@media (max-width: 900px) {
  .content-tabs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .two-columns { grid-template-columns: 1fr; }
}

@media (max-width: 560px) {
  .content-editor-header,
  .editor-section-heading,
  .editor-card-heading,
  .editor-footer { align-items: flex-start; flex-direction: column; }
  .content-tabs { grid-template-columns: 1fr; }
  .content-tab { min-height: 0; }
}
</style>
