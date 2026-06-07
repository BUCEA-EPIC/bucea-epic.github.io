<script setup>
import { ref, onMounted } from 'vue'
import { newsData } from '../data/newsData.js'
import competitionImg from '../assets/news/2025工训-大连.jpg'

const epicLogoImg = `${import.meta.env.BASE_URL}logo.jpg`
const githubUrl = 'https://github.com/BUCEA-EPIC'

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
    <section class="home-hero animate-on-scroll">
      <div class="container hero-layout">
        <div class="hero-media">
          <img :src="epicLogoImg" alt="工程实践创新中心 EPIC 标志" />
        </div>
        <div class="hero-copy">
          <p class="hero-eyebrow">EPIC 317 STUDIO</p>
          <h1>
            <span>工程实践创新中心</span>
            <span>317工作室</span>
          </h1>
          <p>
            面向机器人、机械、电控与计算机视觉的工程实践团队，
            在真实项目和赛事中完成从想法到作品的完整闭环。
          </p>
          <div class="hero-actions">
            <router-link to="/event" class="primary-link">萌新种子杯</router-link>
            <router-link to="/about" class="secondary-link">了解工作室</router-link>
          </div>
          <a
            class="hero-github-link"
            :href="githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="打开 BUCEA-EPIC GitHub 组织（新标签页）"
            title="BUCEA-EPIC GitHub 组织"
          >
            <span>访问 GitHub</span>
            <svg aria-hidden="true" viewBox="0 0 16 16" class="link-icon">
              <path
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.23.49-2.71-1.07-2.71-1.07-.36-.91-.88-1.15-.88-1.15-.72-.49.06-.48.06-.48.8.06 1.22.82 1.22.82.71 1.21 1.87.86 2.33.66.07-.52.28-.86.51-1.06-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.58.82-2.14-.08-.2-.36-1.01.08-2.1 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.09.16 1.9.08 2.1.51.56.82 1.27.82 2.14 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>

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
    <section class="section animate-on-scroll" id="news">
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

/* ========== 首页 Hero ========== */
.home-hero {
  display: flex;
  align-items: center;
  min-height: calc(100svh - 136px);
  padding: 72px 0 88px;
  position: relative;
  overflow: hidden;
}

.hero-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 26px;
  text-align: center;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
}

.hero-eyebrow {
  margin: 0 0 18px;
  color: var(--color-accent-hover);
  font-size: 0.75rem;
  font-weight: 590;
  letter-spacing: 0;
}

.hero-copy h1 {
  margin: 0;
  max-width: 1100px;
  color: var(--color-text);
  font-size: 5.75rem;
  font-weight: 510;
  letter-spacing: -1.584px;
  line-height: 0.98;
}

.hero-copy h1 span {
  display: block;
}

.hero-copy > p:not(.hero-eyebrow) {
  max-width: 760px;
  margin: 28px auto 0;
  color: var(--color-text-secondary);
  font-size: 1.125rem;
  line-height: 1.7;
}

.hero-actions {
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 34px;
}

.hero-actions a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 0 16px;
  border-radius: 6px;
  font-size: 0.94rem;
  font-weight: 510;
}

.primary-link {
  background: var(--color-brand);
  border: 1px solid rgba(130, 143, 255, 0.6);
  color: var(--color-text);
}

.primary-link:hover {
  background: var(--color-accent-hover);
  color: var(--color-text);
}

.secondary-link {
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid var(--border-standard);
  color: var(--color-text-secondary);
}

.secondary-link:hover {
  background: rgba(255, 255, 255, 0.055);
  color: var(--color-text);
}

.hero-github-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 18px;
  color: var(--color-text-secondary);
  font-size: 0.94rem;
  font-weight: 510;
  letter-spacing: 0;
  text-decoration: none;
}

.hero-github-link:hover {
  color: var(--color-text);
}

.hero-github-link .link-icon {
  width: 13px;
  height: 13px;
}

.hero-media {
  overflow: hidden;
  width: 118px;
  height: 118px;
  border: 1px solid var(--border-standard);
  border-radius: 22px;
  background: var(--color-text);
  box-shadow: var(--shadow-card);
}

.hero-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 38%;
  display: block;
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
  width: 100%;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: var(--shadow-soft);
  transition: transform 0.2s ease;
}
.about-image img:hover { transform: translateY(-4px); }

/* ========== 新闻卡片 ========== */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.news-card {
  background: var(--color-card);
  border: 1px solid var(--border-standard);
  border-radius: 8px;
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

::v-deep(.news-card:hover) {
  transform: translateY(-4px);
  border-color: var(--border-strong);
}

.card-image-wrapper {
  overflow: hidden;
  width: 100%;
  height: 200px;
  background: var(--color-panel);
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
  font-weight: 510;
}

.news-card p {
  color: var(--color-text-secondary);
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

@media (max-width: 980px) {
  .hero-copy h1 {
    font-size: 4.35rem;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0;
  }

  .section-title {
    font-size: 2rem;
    line-height: 1.2;
    margin-bottom: 28px;
  }

  .home-hero {
    min-height: calc(100svh - 120px);
    padding: 48px 0 64px;
  }

  .hero-layout {
    gap: 22px;
  }

  .hero-media {
    width: 88px;
    height: 88px;
    border-radius: 18px;
  }

  .hero-copy h1 {
    font-size: 3.15rem;
    line-height: 1.04;
  }

  .hero-copy > p:not(.hero-eyebrow) {
    margin-top: 22px;
    font-size: 1rem;
  }

  .hero-actions a {
    flex: 1 1 150px;
  }

  .hero-github-link {
    margin-top: 14px;
    font-size: 0.9rem;
  }

  .about-section {
    gap: 28px;
  }

  .about-text,
  .about-image {
    min-width: 0;
    width: 100%;
  }

  .about-text h2 {
    font-size: 1.65rem;
    margin-top: 0;
  }

  .about-text p {
    line-height: 1.75;
  }

  .news-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }

  .card-image-wrapper {
    height: 180px;
  }

  .news-card-content {
    padding: 20px;
  }
}

@media (max-width: 420px) {
  .hero-copy h1 {
    font-size: 2.55rem;
  }
}
</style>
