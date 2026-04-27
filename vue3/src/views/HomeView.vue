<script setup>
import { ref, onMounted } from 'vue'
import { newsData } from '../data/newsData.js'
import competitionImg from '../assets/news/2025工训-大连.jpg'

// 只显示最新的三个新闻
const latestNews = ref(newsData.slice(0, 3))

// 滚动动画
onMounted(() => {
  const elements = document.querySelectorAll('.animate-on-scroll')
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        }
      })
    },
    { threshold: 0.1 }
  )
  elements.forEach(el => observer.observe(el))
})
</script>

<template>
  <div>
    <!-- 关于我们 -->
    <section class="section animate-on-scroll" id="about-preview">
      <div class="container about-section">
        <div class="about-text">
          <h2>关于我们</h2>
          <p>
            我们是一个充满激情与创造力的团队，致力于探索机器人的奥秘。
            在这里，你可以学习到从机械设计、电路焊接到编程控制的全方位知识，
            并将你的想法变为现实。
          </p>
          <p>
            无论你是经验丰富的技术达人，还是对机器人充满好奇的初学者，
            我们都欢迎你的加入。
          </p>
        </div>
        <div class="about-image">
          <img :src="competitionImg" alt="工程实践创新中心" />
        </div>
      </div>
    </section>

    <!-- 最新动态 -->
    <section class="section animate-on-scroll" id="news" style="background-color: #ffffff;">
      <div class="container">
        <h2 class="section-title">最新动态</h2>
        <div class="news-grid">
          <div class="news-card" v-for="item in latestNews" :key="item.title">
            <div class="card-image-wrapper">
              <img v-if="item.image" :src="item.image" :alt="item.title" />
              <div v-else class="image-placeholder"></div>
            </div>
            <div class="news-card-content">
              <h3>{{ item.title }}</h3>
              <p>{{ item.excerpt }}</p>
              <small>{{ item.date }}</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ========== 通用结构 ========== */
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.section {
  padding: 80px 0;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 50px;
}

/* ========== 关于我们 ========== */
.about-section {
  display: flex;
  align-items: center;
  gap: 50px;

  /* 关键修改：允许换行 */
  flex-wrap: wrap;
}

.about-text, .about-image {
  flex: 1;

  /* 防止列太窄 */
  min-width: 300px;
}

.about-image {
  text-align: center;
}

.about-image img {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}
.about-image img:hover { transform: scale(1.05); }

/* ========== 新闻卡片 ========== */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.news-card {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

::v-deep(.news-card:hover) {
  transform: translateY(-10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.card-image-wrapper {
  overflow: hidden;
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
}

.card-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

::v-deep(.news-card:hover .card-image-wrapper img) {
  transform: scale(1.1);
}

.news-card-content { padding: 25px; }

.news-card h3 {
  margin-top: 0;
  font-size: 1.2rem;
  font-weight: 500;
}

.news-card p {
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.6;
}

/* ========== 动画区域 ========== */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(50px);
  filter: blur(5px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out, filter 0.8s ease-out;
}
.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}
</style>
