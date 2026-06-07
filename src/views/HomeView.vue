<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { newsData } from '../data/newsData.js'
import competitionImg from '../assets/news/2025工训-大连.jpg'

const epicLogoImg = `${import.meta.env.BASE_URL}logo.jpg`
const githubUrl = 'https://github.com/BUCEA-EPIC'
const latestNews = ref(newsData.slice(0, 3))

const focusAreas = ['机器人系统', '机械结构', '电控与驱动', '计算机视觉']

let sectionObserver

onMounted(() => {
  const elements = document.querySelectorAll('.animate-on-scroll')

  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        }
      })
    },
    { threshold: 0.14 }
  )

  elements.forEach((element) => sectionObserver?.observe(element))
})

onBeforeUnmount(() => {
  sectionObserver?.disconnect()
  sectionObserver = null
})
</script>

<template>
  <div class="home-view">
    <section class="home-hero animate-on-scroll">
      <div class="hero-background" aria-hidden="true">
        <img :src="competitionImg" alt="" />
      </div>

      <div class="container hero-layout">
        <div class="hero-copy">
          <div class="hero-brand">
            <img :src="epicLogoImg" alt="工程实践创新中心 EPIC 标志" />
            <span>EPIC 317 STUDIO</span>
          </div>

          <h1>
            工程实践创新中心
            <span>317工作室</span>
          </h1>

          <p class="hero-description">
            面向机器人、机械、电控与计算机视觉的工程实践团队，
            在真实项目、长期训练与赛事协作中，把想法推进为能够落地的作品。
          </p>

          <div class="hero-actions">
            <router-link to="/event" class="primary-link">萌新种子杯</router-link>
            <router-link to="/about" class="secondary-link">了解工作室</router-link>
          </div>

          <div class="hero-links">
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

          <div class="hero-focus" aria-label="工作室技术方向">
            <span v-for="area in focusAreas" :key="area">{{ area }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section animate-on-scroll" id="about-preview">
      <div class="container about-section">
        <div class="about-text">
          <span class="section-kicker">ABOUT</span>
          <h2>关于我们</h2>
          <p>
            我们围绕真实工程问题展开协作，持续把机械结构、电控系统、嵌入式与感知算法整合成完整作品。
          </p>
          <p>
            在这里，成员从基础学习走向项目推进，从单点技能走向系统协同，在长期训练和复盘中形成自己的工程判断力。
          </p>
          <router-link to="/about" class="section-link">深入了解工作室</router-link>
        </div>

        <div class="about-image">
          <img :src="competitionImg" alt="工程实践创新中心团队活动现场" />
        </div>
      </div>
    </section>

    <section class="section animate-on-scroll" id="news">
      <div class="container">
        <div class="section-heading">
          <div>
            <span class="section-kicker">NEWS</span>
            <h2 class="section-title">最新动态</h2>
          </div>
          <router-link to="/news" class="section-link">查看全部动态</router-link>
        </div>

        <div class="news-grid">
          <article
            v-for="(item, index) in latestNews"
            :key="item.title"
            class="news-card"
            :style="{ '--index': index }"
          >
            <div class="card-image-wrapper">
              <img v-if="item.image" :src="item.image" :alt="item.title" />
              <div v-else class="image-placeholder"></div>
            </div>

            <div class="news-card-content">
              <div class="news-meta">
                <span>0{{ index + 1 }}</span>
                <small>{{ item.date }}</small>
              </div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.excerpt }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  position: relative;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.section {
  padding: 84px 0;
}

.section-kicker {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid rgba(130, 143, 255, 0.24);
  border-radius: 9999px;
  background: rgba(113, 112, 255, 0.08);
  color: #bcc6ff;
  font-size: 0.76rem;
  font-weight: 590;
  letter-spacing: 0.08em;
}

.section-title,
.about-text h2 {
  margin: 18px 0 0;
  color: var(--color-text);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 510;
  line-height: 1;
}

.section-link {
  display: inline-flex;
  align-items: center;
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  background: rgba(255, 255, 255, 0.03);
  color: var(--color-text-secondary);
  font-size: 0.94rem;
  font-weight: 510;
  transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

.section-link:hover {
  color: var(--color-text);
  border-color: rgba(130, 143, 255, 0.34);
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-2px);
}

.home-hero {
  position: relative;
  min-height: calc(100svh - 156px);
  margin: 0 -20px;
  padding: 88px 20px 104px;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
}

.hero-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 32%;
  filter: saturate(0.86) brightness(0.38);
  transform: scale(1.04);
  animation: heroBackdropShift 16s ease-in-out infinite alternate;
}

.hero-background::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(1, 1, 2, 0.18), rgba(1, 1, 2, 0.72) 28%, rgba(1, 1, 2, 0.9) 82%, rgba(1, 1, 2, 0.98)),
    linear-gradient(90deg, rgba(1, 1, 2, 0.78), rgba(1, 1, 2, 0.42) 42%, rgba(1, 1, 2, 0.78));
}

.hero-layout {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  min-height: calc(100svh - 260px);
}

.hero-copy {
  max-width: 760px;
}

.hero-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 40px;
  padding: 6px 14px 6px 6px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 9999px;
  background: rgba(8, 9, 10, 0.34);
  backdrop-filter: blur(14px);
}

.hero-brand img {
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.96);
}

.hero-brand span {
  color: rgba(240, 244, 255, 0.84);
  font-size: 0.8rem;
  font-weight: 590;
  letter-spacing: 0.08em;
}

.hero-copy h1 {
  margin: 26px 0 0;
  color: var(--color-text);
  font-size: clamp(3.25rem, 7vw, 5.8rem);
  font-weight: 510;
  letter-spacing: -1.6px;
  line-height: 0.97;
}

.hero-copy h1 span {
  display: block;
  background: linear-gradient(90deg, #f7f8f8 0%, #c8d0ff 58%, #eef1ff 100%);
  -webkit-background-clip: text;
  color: transparent;
}

.hero-description {
  max-width: 660px;
  margin: 24px 0 0;
  color: rgba(230, 235, 247, 0.84);
  font-size: 1.08rem;
  line-height: 1.76;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 34px;
}

.hero-actions a,
.hero-links a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 16px;
  border-radius: 6px;
  font-size: 0.94rem;
  font-weight: 510;
  transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.hero-actions a:hover,
.hero-links a:hover {
  transform: translateY(-2px);
}

.primary-link {
  border: 1px solid rgba(130, 143, 255, 0.58);
  background: rgba(94, 106, 210, 0.82);
  box-shadow: 0 12px 30px rgba(94, 106, 210, 0.24);
  color: var(--color-text);
}

.primary-link:hover {
  background: var(--color-accent-hover);
  color: var(--color-text);
}

.secondary-link,
.hero-github-link {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(8, 9, 10, 0.28);
  color: rgba(240, 244, 255, 0.86);
  backdrop-filter: blur(12px);
}

.secondary-link:hover,
.hero-github-link:hover {
  border-color: rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-text);
}

.hero-links {
  margin-top: 14px;
}

.hero-github-link {
  gap: 6px;
}

.link-icon {
  width: 13px;
  height: 13px;
}

.hero-focus {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  margin-top: 34px;
}

.hero-focus span {
  position: relative;
  color: rgba(208, 214, 224, 0.84);
  font-size: 0.9rem;
  font-weight: 510;
  padding-left: 16px;
}

.hero-focus span::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: linear-gradient(180deg, var(--color-accent-hover), #9af6d5);
  transform: translateY(-50%);
}

.about-section {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 460px);
  gap: 40px;
  align-items: center;
}

.about-text p {
  margin: 20px 0 0;
  color: var(--color-text-secondary);
  line-height: 1.78;
}

.about-text .section-link {
  margin-top: 28px;
}

.about-image {
  overflow: hidden;
  border: 1px solid var(--border-standard);
  border-radius: 8px;
  box-shadow: var(--shadow-soft);
}

.about-image img {
  display: block;
  width: 100%;
  min-height: 320px;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.about-image:hover img {
  transform: scale(1.03);
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 34px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.news-card {
  opacity: 0;
  transform: translateY(24px);
  border: 1px solid var(--border-standard);
  border-radius: 8px;
  background: var(--color-card);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition:
    opacity 0.5s ease,
    transform 0.5s ease,
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
  transition-delay: calc(var(--index) * 80ms + 120ms);
}

#news.is-visible .news-card {
  opacity: 1;
  transform: translateY(0);
}

.news-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-strong);
  background: var(--color-card-hover);
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.18);
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
  transition: transform 0.35s ease;
}

.news-card:hover .card-image-wrapper img {
  transform: scale(1.05);
}

.news-card-content {
  padding: 22px;
}

.news-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.news-meta span {
  color: var(--color-accent-hover);
  font-size: 0.78rem;
  font-weight: 590;
  letter-spacing: 0.08em;
}

.news-meta small {
  color: var(--color-text-muted);
  font-size: 0.82rem;
}

.news-card h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.18rem;
  font-weight: 510;
  line-height: 1.36;
}

.news-card p {
  margin: 14px 0 0;
  color: var(--color-text-secondary);
  font-size: 0.92rem;
  line-height: 1.68;
}

.animate-on-scroll {
  opacity: 0;
  transform: translateY(32px);
  filter: blur(8px);
  transition: opacity 0.72s ease, transform 0.72s ease, filter 0.72s ease;
}

.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

@keyframes heroBackdropShift {
  from {
    transform: scale(1.04) translate3d(0, 0, 0);
  }

  to {
    transform: scale(1.08) translate3d(0, -1%, 0);
  }
}

@media (max-width: 980px) {
  .news-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 12px;
  }

  .section {
    padding: 56px 0;
  }

  .home-hero {
    min-height: calc(100svh - 132px);
    margin: 0 -12px;
    padding: 56px 12px 72px;
  }

  .hero-layout {
    min-height: calc(100svh - 240px);
    align-items: center;
  }

  .hero-copy {
    text-align: center;
  }

  .hero-brand {
    justify-content: center;
  }

  .hero-copy h1 {
    font-size: 3.1rem;
    line-height: 1.02;
  }

  .hero-description {
    margin-left: auto;
    margin-right: auto;
    font-size: 1rem;
  }

  .hero-actions,
  .hero-focus {
    justify-content: center;
  }

  .hero-actions a {
    flex: 1 1 150px;
  }

  .about-section {
    grid-template-columns: minmax(0, 1fr);
    gap: 26px;
  }

  .about-image img {
    min-height: 240px;
  }

  .section-heading {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 26px;
  }

  .news-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
  }

  .news-card-content {
    padding: 20px;
  }
}

@media (max-width: 420px) {
  .hero-copy h1 {
    font-size: 2.58rem;
  }

  .hero-brand {
    width: 100%;
    justify-content: center;
  }

  .hero-focus {
    gap: 10px 14px;
  }

  .hero-focus span {
    font-size: 0.86rem;
  }
}
</style>
