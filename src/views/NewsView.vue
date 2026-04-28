<script setup>
import { onMounted, computed } from 'vue'
import { newsData } from '../data/newsData.js'

// 正序显示新闻（从最早到最新）
const reversedNews = computed(() => [...newsData]) // 不再 reverse()

// 滚动入场动画
onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        }
      })
    },
    { threshold: 0.1 }
  )

  document.querySelectorAll('.news-item-wrapper').forEach(el => observer.observe(el))
})
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
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.header { text-align: center; padding: 60px 20px; margin-bottom: 40px; position: relative; overflow: hidden; }
.header-bg-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 10rem; font-weight: 590; color: rgba(255,255,255,0.032); z-index: 1; user-select: none; white-space: nowrap; }
.header h1, .header p { position: relative; z-index: 2; animation: fadeInUp 0.8s ease-out forwards; }
.header h1 { font-size: 3.5rem; font-weight: 510; letter-spacing: -1.056px; margin-bottom: 20px; }
.header h1::after { content: ''; display: block; width: 42px; height: 1px; background: linear-gradient(90deg, transparent, var(--color-accent-hover), transparent); margin: 20px auto 0; }
.header p { font-size: 1.25rem; color: var(--color-text-secondary); margin-top: 0; animation-delay:0.2s; }

.page-container { max-width: 900px; margin: 0 auto; padding: 0 20px 40px; }

.news-item-wrapper { opacity: 0; transform: translateY(40px); transition: opacity 0.6s ease-out var(--delay), transform 0.6s ease-out var(--delay); margin-bottom: 40px; }
.news-item-wrapper.is-visible { opacity: 1; transform: translateY(0); }

.news-item-inner { display: flex; overflow: hidden; background: var(--color-card); border: 1px solid var(--border-standard); border-radius: 8px; box-shadow: var(--shadow-card); transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease; }
.news-item-inner:hover { transform: translateY(-4px); border-color: var(--border-strong); background: var(--color-card-hover); }

.news-image { flex: 0 0 250px; overflow: hidden; }
.news-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease-out; }
.news-item-inner:hover .news-image img { transform: scale(1.1); }

.news-content { padding: 30px; flex: 1; }
.news-content h2 { margin-top: 0; color: var(--color-text); font-size: 1.5rem; font-weight: 510; letter-spacing: -0.288px; }
.news-content .meta { font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 15px; }
.news-content p { line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 0; }

@media (max-width: 768px) {
  .header-bg-text { font-size: 6rem; }
  .news-item-inner { flex-direction: column; }
  .news-item-wrapper { margin-bottom: 24px; }
  .news-image {
    flex: 0 0 auto;
    height: 190px;
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
