<script setup>
</script>

<template>
  <div class="page-container">
    <div class="header">
      <span class="header-bg-text">404</span>
      <h1>页面未找到</h1>
      <p>你访问的地址不存在，可能已被移动或删除。</p>
    </div>

    <div class="not-found-actions">
      <router-link to="/" class="back-home-link">返回首页</router-link>
      <router-link to="/event" class="back-event-link">查看萌新种子杯</router-link>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--page-gutter) 96px;
}

.not-found-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.back-home-link,
.back-event-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  background: rgba(255, 255, 255, 0.025);
  color: var(--color-text-secondary);
  font-size: 0.94rem;
  font-weight: 510;
  text-decoration: none;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.back-home-link {
  border-color: var(--color-brand);
  background: var(--color-brand);
  color: var(--color-text);
}

.back-home-link:hover {
  background: var(--color-brand-strong);
  border-color: var(--color-brand-strong);
}

.back-event-link:hover {
  border-color: var(--border-strong);
  background: rgba(255, 255, 255, 0.045);
  color: var(--color-text);
}
</style>
