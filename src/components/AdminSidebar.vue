<script setup>
defineProps({
  activeSection: {
    type: String,
    required: true
  }
})

const navigation = [
  { key: 'overview', path: '/admin', index: '01', label: '总览', hint: '发布状态与快捷操作' },
  { key: 'content', path: '/admin/content', index: '02', label: '内容管理', hint: '站点文字与结构化内容' },
  { key: 'operations', path: '/admin/operations', index: '03', label: '运营资源', hint: '二维码与运营素材' },
  { key: 'audit', path: '/admin/audit', index: '04', label: '操作记录', hint: '管理员审计信息' },
  { key: 'security', path: '/admin/security', index: '05', label: '访问与安全', hint: '环境配置与恢复流程' }
]
</script>

<template>
  <aside class="admin-sidebar" aria-label="管理员后台导航">
    <div class="admin-sidebar-brand">
      <span class="admin-sidebar-mark" aria-hidden="true">R</span>
      <div>
        <strong>Ray-space</strong>
        <span>管理控制台</span>
      </div>
    </div>

    <div class="admin-sidebar-group">
      <p class="admin-sidebar-label">工作区</p>
      <nav class="admin-nav">
        <RouterLink
          v-for="item in navigation"
          :key="item.key"
          :to="item.path"
          class="admin-nav-item"
          :class="{ active: activeSection === item.key }"
          :aria-current="activeSection === item.key ? 'page' : undefined"
          :title="item.hint"
        >
          <span class="admin-nav-index">{{ item.index }}</span>
          <span class="admin-nav-copy">
            <strong>{{ item.label }}</strong>
            <small>{{ item.hint }}</small>
          </span>
        </RouterLink>
      </nav>
    </div>

  </aside>
</template>

<style scoped>
.admin-sidebar {
  display: flex;
  flex-direction: column;
  min-height: 620px;
  padding: 22px 14px;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-panel);
  background: var(--color-panel);
}

.admin-sidebar-brand {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 10px 24px;
  border-bottom: 1px solid var(--border-subtle);
}

.admin-sidebar-mark {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(141, 152, 216, 0.48);
  border-radius: 9px;
  background: rgba(141, 152, 216, 0.12);
  color: var(--color-accent-hover);
  font-size: 1rem;
  font-weight: 650;
}

.admin-sidebar-brand strong,
.admin-sidebar-brand span {
  display: block;
}

.admin-sidebar-brand strong {
  color: var(--color-text);
  font-size: 0.95rem;
  font-weight: 590;
}

.admin-sidebar-brand span {
  margin-top: 2px;
  color: var(--color-text-muted);
  font-size: 0.76rem;
}

.admin-sidebar-group {
  margin-top: 26px;
}

.admin-sidebar-label {
  margin: 0 10px 9px;
  color: var(--color-text-subtle);
  font-size: 0.7rem;
  font-weight: 590;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.admin-nav {
  display: grid;
  gap: 4px;
}

.admin-nav-item {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  width: 100%;
  padding: 11px 10px;
  border: 1px solid transparent;
  border-radius: var(--radius-control);
  background: transparent;
  color: var(--color-text-secondary);
  text-align: left;
  cursor: pointer;
}

.admin-nav-item:hover,
.admin-nav-item.active {
  border-color: var(--border-standard);
  background: rgba(141, 152, 216, 0.1);
  color: var(--color-text);
}

.admin-nav-index {
  padding-top: 1px;
  color: var(--color-text-subtle);
  font-size: 0.7rem;
  font-variant-numeric: tabular-nums;
}

.admin-nav-item.active .admin-nav-index {
  color: var(--color-accent-hover);
}

.admin-nav-copy {
  min-width: 0;
}

.admin-nav-copy strong,
.admin-nav-copy small {
  display: block;
}

.admin-nav-copy strong {
  font-size: 0.9rem;
  font-weight: 510;
}

.admin-nav-copy small {
  margin-top: 3px;
  color: var(--color-text-muted);
  font-size: 0.74rem;
  line-height: 1.4;
}

@media (max-width: 860px) {
  .admin-sidebar {
    min-height: 0;
  }

  .admin-nav {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .admin-nav {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
