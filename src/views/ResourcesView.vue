<script setup>
import { ref } from 'vue'
import { resources } from '../data/resourcesData.js'
import { useRevealOnScroll } from '../composables/useRevealOnScroll.js'

const resourceList = ref(resources)

useRevealOnScroll()
</script>

<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="header">
      <span class="header-bg-text">LEARN</span>
      <h1>教程与资源</h1>
      <p>我们整理的学习宝库，助你从入门到精通</p>
    </div>

    <!-- 核心内容 -->
    <div
      class="resource-section animate-on-scroll"
      v-for="section in resourceList"
      :key="section.category"
    >
      <h2>{{ section.category }}</h2>
      <p class="section-description">{{ section.description }}</p>
      <ul class="resource-grid">
        <li
          v-for="(item, index) in section.items"
          :key="item.title"
          :style="{ '--delay': `${index * 0.05}s` }"
        >
          <div class="card-content">
            <a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
            <p v-if="item.subtitle" class="subtitle">{{ item.subtitle }}</p>
            <p>{{ item.description }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.page-container { max-width: 1100px; margin:0 auto; padding:0 20px 40px; }
.resource-section { margin-bottom: 60px; }
.section-description { font-size:1rem; color:var(--color-text-secondary); margin-bottom:20px; }

/* 滚动动画 */
.animate-on-scroll { opacity:0; }
.animate-on-scroll.is-visible { opacity:1; }
.animate-on-scroll li {
  opacity:0;
  transform: translateY(30px);
  transition: opacity 0.5s ease-out var(--delay), transform 0.5s ease-out var(--delay);
}
.animate-on-scroll.is-visible li {
  opacity:1;
  transform: translateY(0);
}

/* 资源标题 */
.resource-section h2 { font-size: 2rem; font-weight: 510; border-bottom:1px solid var(--border-standard); padding-bottom:10px; margin-bottom:30px; color: var(--color-text); letter-spacing: -0.704px; }

/* Grid 布局 */
.resource-grid { list-style:none; padding:0; display:grid; grid-template-columns: repeat(3, 1fr); gap:25px; }

/* 响应式 */
@media (max-width:992px) { .resource-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width:768px) {
  .resource-section { margin-bottom: 42px; }
  .resource-section h2 { margin-bottom: 18px; }
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
  border-radius:8px;
  box-shadow:var(--shadow-card);
  display:flex;
  transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}
.resource-grid li:hover { transform:translateY(-4px); border-color:var(--border-strong); background:var(--color-card-hover); }

.card-content { padding:25px; display:flex; flex-direction:column; width:100%; }
.card-content a { font-weight:510; font-size:1.2rem; color:var(--color-accent-hover); text-decoration:none; margin-bottom:10px; }
.card-content a:hover { color: var(--color-text); text-decoration:none; }
.card-content .subtitle { font-weight:510; font-size:1rem; color:var(--color-text-secondary); margin-bottom:10px; }
.card-content p { margin:0; color:var(--color-text-muted); line-height:1.6; font-size:0.9rem; flex-grow:1; }
</style>
