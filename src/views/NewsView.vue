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
        :style="{ '--delay': `${index * 0.1}s` }"
      >
        <div class="news-item-inner">
          <div v-if="item.image" class="news-image">
            <img :src="item.image" :alt="item.title" />
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
.page-container { max-width: 900px; margin: 0 auto; padding: 0 var(--page-gutter) 40px; }

.news-item-wrapper { opacity: 0; transition: opacity 0.35s ease; margin-bottom: 28px; }
.news-item-wrapper.is-visible { opacity: 1; }

.news-item-inner { display: flex; overflow: hidden; background: var(--color-card); border: 1px solid var(--border-standard); border-radius: 6px; box-shadow: none; transition: border-color 0.2s ease, background-color 0.2s ease; }
.news-item-inner:hover { border-color: var(--border-strong); background: var(--color-card-hover); }

.news-image { flex: 0 0 250px; overflow: hidden; }
.news-image img { width: 100%; height: 100%; object-fit: cover; }

.news-content { padding: 30px; flex: 1; }
.news-content h2 { margin-top: 0; color: var(--color-text); font-size: 1.5rem; font-weight: 510; letter-spacing: 0; }
.news-content .meta { font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 15px; }
.news-content p { line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 0; }

@media (max-width: 768px) {
  .news-item-inner { flex-direction: column; }
  .news-item-wrapper { margin-bottom: 24px; }
  .news-image {
    flex: 0 0 auto;
    aspect-ratio: 16 / 10;
  }
  .news-content { padding: 22px; }
  .news-content h2 {
    font-size: 1.28rem;
    line-height: 1.35;
  }
  .news-content p {
    line-height: 1.65;
  }
}
</style>
