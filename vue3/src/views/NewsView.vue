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
.header-bg-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 10rem; font-weight: 900; color: rgba(0,0,0,0.04); z-index: 1; user-select: none; white-space: nowrap; }
.header h1, .header p { position: relative; z-index: 2; animation: fadeInUp 0.8s ease-out forwards; }
.header h1 { font-size: 3.5rem; font-weight: 300; margin-bottom: 20px; }
.header h1::after { content: ''; display: block; width: 60px; height: 4px; background-color: #007bff; margin: 20px auto 0; }
.header p { font-size: 1.25rem; color: #6c757d; margin-top: 0; animation-delay:0.2s; }

.page-container { max-width: 900px; margin: 0 auto; padding: 0 20px 40px; }

.news-item-wrapper { opacity: 0; transform: translateY(40px); transition: opacity 0.6s ease-out var(--delay), transform 0.6s ease-out var(--delay); margin-bottom: 40px; }
.news-item-wrapper.is-visible { opacity: 1; transform: translateY(0); }

.news-item-inner { display: flex; overflow: hidden; background: #fff; border-radius: 8px; box-shadow: 0 5px 25px rgba(0,0,0,0.07); transition: transform 0.3s ease-out, box-shadow 0.3s ease-out; }
.news-item-inner:hover { transform: translateY(-8px); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }

.news-image { flex: 0 0 250px; overflow: hidden; }
.news-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease-out; }
.news-item-inner:hover .news-image img { transform: scale(1.1); }

.news-content { padding: 30px; flex: 1; }
.news-content h2 { margin-top: 0; color: #343a40; font-size: 1.5rem; }
.news-content .meta { font-size: 0.9rem; color: #6c757d; margin-bottom: 15px; }
.news-content p { line-height: 1.7; color: #495057; margin-bottom: 0; }

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
