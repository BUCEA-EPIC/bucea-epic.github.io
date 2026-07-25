<script setup>
import { computed } from 'vue'
import { newsData } from '../data/newsData.js'
import { useRevealOnScroll } from '../composables/useRevealOnScroll.js'

// 正序显示新闻（从最早到最新）
const reversedNews = computed(() => [...newsData]) // 不再 reverse()

useRevealOnScroll('.news-item-wrapper')
</script>

<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="header">
      <span class="header-bg-text">NEWS</span>
      <h1>新闻与动态</h1>
      <p>记录成长的足迹，分享每一次突破</p>
    </div>

    <!-- 新闻列表 -->
    <div class="news-list">
      <div
        class="news-item-wrapper"
        v-for="(item, index) in reversedNews"
        :key="item.title"
        :class="{ featured: index === 0 }"
        :style="{ '--delay': `${index * 0.1}s` }"
      >
        <div class="news-item-inner">
          <div v-if="item.image" class="news-image">
            <img :src="item.image" :alt="item.title" loading="lazy" decoding="async" />
          </div>
          <div class="news-content">
            <h2>{{ item.title }}</h2>
            <div class="meta">发布于 {{ item.date }}</div>
            <p>{{ item.excerpt }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container { max-width: var(--container); margin: 0 auto; padding: 0 var(--page-gutter) 56px; }

.news-list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; }
.news-item-wrapper { min-width: 0; opacity: 0; transition: opacity 0.35s ease; }
.news-item-wrapper.is-visible { opacity: 1; }
.news-item-wrapper.featured { grid-column: 1 / -1; }

.news-item-inner { display: flex; flex-direction: column; height: 100%; overflow: hidden; background: var(--color-card); border: 1px solid var(--border-standard); border-radius: var(--radius-card); box-shadow: none; transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease; }
.news-item-inner:hover { border-color: var(--border-strong); background: var(--color-card-hover); }
.featured .news-item-inner { display: grid; grid-template-columns: minmax(360px, 1.2fr) minmax(0, 0.8fr); }

.news-image { overflow: hidden; aspect-ratio: 16 / 10; }
.featured .news-image { min-height: 360px; aspect-ratio: auto; }
.news-image img { width: 100%; height: 100%; object-fit: cover; }

.news-content { display: flex; flex: 1; flex-direction: column; padding: 24px; }
.featured .news-content { justify-content: center; padding: 42px; }
.news-content h2 { margin-top: 0; color: var(--color-text); font-size: 1.5rem; font-weight: 510; letter-spacing: 0; }
.featured .news-content h2 { font-size: 2rem; line-height: 1.25; }
.news-content .meta { font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 15px; }
.news-content p { line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 0; }

@media (max-width: 980px) {
  .news-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 768px) {
  .news-list { grid-template-columns: minmax(0, 1fr); gap: 18px; }
  .news-item-wrapper.featured { grid-column: auto; }
  .featured .news-item-inner { display: flex; }
  .news-image {
    flex: 0 0 auto;
    aspect-ratio: 16 / 10;
  }
  .featured .news-image { min-height: 0; aspect-ratio: 16 / 10; }
  .news-content { padding: 22px; }
  .featured .news-content { padding: 24px 22px; }
  .news-content h2 {
    font-size: 1.28rem;
    line-height: 1.35;
  }
  .featured .news-content h2 { font-size: 1.45rem; }
  .news-content p {
    line-height: 1.65;
  }
}
</style>
