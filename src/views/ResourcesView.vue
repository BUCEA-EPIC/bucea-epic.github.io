<script setup>
import { computed } from 'vue'
import { useRevealOnScroll } from '../composables/useRevealOnScroll.js'
import { useSiteContent } from '../composables/useSiteContent.js'

useRevealOnScroll()

const { content } = useSiteContent()
const resources = computed(() => content.resources)
</script>

<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <header class="header">
      <span class="header-bg-text">LEARN</span>
      <h1>教程与资源</h1>
      <p>我们整理的学习宝库，助你从入门到精通</p>
    </header>

    <!-- 核心内容 -->
    <div
      class="resource-section animate-on-scroll"
      v-for="(section, sectionIndex) in resources"
      :key="section.category"
    >
      <div class="resource-heading">
        <span>0{{ sectionIndex + 1 }}</span>
        <div>
          <h2>{{ section.category }}</h2>
          <p class="section-description">{{ section.description }}</p>
        </div>
      </div>
      <ul class="resource-grid">
        <li
          v-for="(item, index) in section.items"
          :key="item.title"
          :style="{ '--item-index': index }"
        >
          <div class="card-content">
            <span class="resource-index">{{ String(index + 1).padStart(2, '0') }}</span>
            <a :href="item.url" target="_blank" rel="noopener noreferrer">
              <span>{{ item.title }}</span>
              <span aria-hidden="true">↗</span>
            </a>
            <p v-if="item.subtitle" class="subtitle">{{ item.subtitle }}</p>
            <p>{{ item.description }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.page-container { max-width: var(--container); margin:0 auto; padding:0 var(--page-gutter) 56px; }
.resource-section { margin-bottom: 82px; }
.resource-heading { display: grid; grid-template-columns: 42px minmax(0, 1fr); gap: 18px; align-items: start; margin-bottom: 28px; padding-bottom: 24px; border-bottom: 1px solid var(--border-standard); }
.resource-heading > span { padding-top: 7px; color: var(--color-accent); font-size: 0.76rem; font-weight: 590; }
.section-description { max-width: 720px; font-size:1rem; color:var(--color-text-secondary); margin:12px 0 0; }

/* 滚动动画：基础显隐规则在全局 styles/main.css，此处仅保留列表项差异 */
.animate-on-scroll li {
  opacity:0;
  transform: translateY(10px);
}
.animate-on-scroll.is-visible li {
  opacity:1;
  transform:none;
  transition-delay: calc(var(--item-index) * 70ms), calc(var(--item-index) * 70ms), 0ms, 0ms, 0ms;
}

/* 资源标题 */
.resource-section h2 { font-size: 2rem; font-weight: 510; border: 0; padding: 0; margin: 0; color: var(--color-text); letter-spacing: 0; }

/* Grid 布局 */
.resource-grid { list-style:none; padding:0; display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap:18px; }

/* 响应式 */
@media (max-width:980px) { .resource-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width:768px) {
  .resource-section { margin-bottom: 56px; }
  .resource-heading { grid-template-columns: 32px minmax(0, 1fr); gap: 10px; margin-bottom: 20px; padding-bottom: 20px; }
  .resource-section h2 { font-size: 1.6rem; }
  .resource-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
  }
  .card-content { padding: 20px; }
  .card-content a {
    font-size: 1.08rem;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }
}

.resource-grid li {
  background:var(--color-card);
  border:1px solid var(--border-standard);
  border-radius: var(--radius-card);
  box-shadow:none;
  display:flex;
  transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}
.resource-grid li:hover { border-color:var(--border-strong); background:var(--color-card-hover); }

.card-content { min-height: 290px; padding:24px; display:flex; flex-direction:column; width:100%; }
.resource-index { margin-bottom: 22px; color: var(--color-text-muted); font-size: 0.74rem; font-weight: 590; }
.card-content a { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; font-weight:510; font-size:1.15rem; line-height: 1.35; color:var(--color-text); text-decoration:none; margin-bottom:10px; overflow-wrap:anywhere; }
.card-content a > span:last-child { flex: 0 0 auto; color: var(--color-text-muted); font-size: 0.9rem; }
.card-content a:hover { color: var(--color-text); text-decoration:none; }
.card-content .subtitle { font-weight:510; font-size:1rem; color:var(--color-text-secondary); margin-bottom:10px; }
.card-content p { margin:0; color:var(--color-text-muted); line-height:1.6; font-size:0.9rem; flex-grow:1; }

@media (max-width: 768px) {
  .card-content { min-height: 0; padding: 20px; }
}

@media (prefers-reduced-motion: reduce) {
  .animate-on-scroll li {
    opacity: 1;
    transform: none;
  }
}
</style>
