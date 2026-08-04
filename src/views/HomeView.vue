<script setup>
import studioImg from '../assets/about/studio-1.webp'
import IconGithub from '../components/IconGithub.vue'
import { SITE_LOGO } from '../data/siteInfo.js'
import { useRevealOnScroll } from '../composables/useRevealOnScroll.js'
import { computed } from 'vue'
import { useSiteContent } from '../composables/useSiteContent.js'

// hero 图放在 public/ 并在 index.html 中 preload，避免等主 JS 执行后才被发现（LCP）
const competitionImg = `${import.meta.env.BASE_URL}hero.webp`
const epicLogoImg = SITE_LOGO
const { content } = useSiteContent()
const githubUrl = computed(() => content.site.githubUrl)
const latestNews = computed(() => content.news.slice(0, 3))

const focusAreas = ['机器人系统', '机械结构', '电控与驱动', '计算机视觉']
const exploreLinks = [
  { index: '01', title: '项目与机器人', description: '查看从机械结构到感知算法的完整工程作品。', to: '/projects' },
  { index: '02', title: '团队成员', description: '认识共同推进训练、赛事与项目的伙伴。', to: '/team' },
  { index: '03', title: '教程与资源', description: '从基础概念开始，逐步进入工程实践。', to: '/resources' },
  { index: '04', title: '联系我们', description: '交流技术问题、合作想法或加入团队。', to: '/contact' }
]

useRevealOnScroll()
</script>

<template>
  <div class="home-view">
    <section class="home-hero animate-on-scroll">
      <div class="hero-background" aria-hidden="true">
        <img :src="competitionImg" alt="" fetchpriority="high" />
      </div>

      <div class="container hero-layout">
        <div class="hero-copy">
          <div class="hero-brand">
            <img :src="epicLogoImg" alt="工程实践创新中心 EPIC 标志" />
            <span>RAY-SPACE STUDIO</span>
          </div>

          <h1>
            工程实践创新中心
            <span>光启 Ray-space 工作室</span>
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
              aria-label="打开 BUCEA-EPIC 开源仓库（新标签页）"
              title="BUCEA-EPIC 开源仓库"
            >
              <span>查看开源仓库</span>
              <IconGithub />
            </a>
          </div>

          <ul class="hero-focus" aria-label="工作室技术方向">
            <li v-for="area in focusAreas" :key="area">{{ area }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section animate-on-scroll" id="about-preview" aria-labelledby="about-preview-title">
      <div class="container about-section">
        <div class="about-text">
          <span class="section-kicker">ABOUT</span>
          <h2 id="about-preview-title">关于我们</h2>
          <p>
            我们围绕真实工程问题展开协作，持续把机械结构、电控系统、嵌入式与感知算法整合成完整作品。
          </p>
          <p>
            在这里，成员从基础学习走向项目推进，从单点技能走向系统协同，在长期训练和复盘中形成自己的工程判断力。
          </p>
          <router-link to="/about" class="section-link">深入了解工作室</router-link>
        </div>

        <div class="about-image">
          <img :src="studioImg" alt="光启 Ray-space 工作室环境" loading="lazy" decoding="async" />
        </div>
      </div>
    </section>

    <section class="section explore-section animate-on-scroll" aria-labelledby="explore-title">
      <div class="container">
        <div class="section-heading explore-heading">
          <div>
            <span class="section-kicker">EXPLORE</span>
            <h2 id="explore-title" class="section-title">从这里开始</h2>
          </div>
          <p>找到作品、伙伴与学习路径，把一次兴趣变成持续实践。</p>
        </div>

        <div class="explore-grid">
          <router-link
            v-for="item in exploreLinks"
            :key="item.to"
            :to="item.to"
            class="explore-link"
          >
            <span class="explore-index">{{ item.index }}</span>
            <div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
            <span class="explore-arrow" aria-hidden="true">→</span>
          </router-link>
        </div>
      </div>
    </section>

    <section class="section news-section animate-on-scroll" id="news" aria-labelledby="news-title">
      <div class="container">
        <div class="section-heading">
          <div>
            <span class="section-kicker">NEWS</span>
            <h2 id="news-title" class="section-title">最新动态</h2>
          </div>
          <router-link to="/news" class="section-link">查看全部动态</router-link>
        </div>

        <div class="news-grid">
          <article
            v-for="(item, index) in latestNews"
            :key="item.title"
            class="news-card"
          >
            <div class="card-image-wrapper">
              <img v-if="item.image" :src="item.image" :alt="item.title" loading="lazy" decoding="async" />
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
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--page-gutter);
}

.section {
  padding: 96px 0;
  border-top: 1px solid var(--border-subtle);
}

.section-kicker {
  display: block;
  color: var(--color-text-muted);
  font-size: 0.76rem;
  font-weight: 590;
  letter-spacing: 0.08em;
}

.section-title,
.about-text h2 {
  margin: 10px 0 0;
  color: var(--color-text);
  font-size: 2.4rem;
  font-weight: 510;
  line-height: 1;
}

.section-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 0.94rem;
  font-weight: 510;
  text-decoration: underline;
  text-decoration-color: var(--border-standard);
  text-underline-offset: 5px;
  transition: text-decoration-color 0.2s ease, color 0.2s ease;
}

.section-link:hover {
  color: var(--color-text);
  text-decoration-color: var(--color-text-secondary);
  background: transparent;
}

.home-hero {
  position: relative;
  display: flex;
  min-height: calc(100svh - 68px);
  margin: 0;
  padding: 74px 0 96px;
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
  filter: saturate(0.8) brightness(0.48);
}

.hero-background::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(8, 9, 10, 0.96) 0%, rgba(8, 9, 10, 0.75) 58%, rgba(8, 9, 10, 0.38) 100%);
}

.hero-layout {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  align-items: center;
  min-height: 0;
}

.hero-copy {
  max-width: 790px;
}

.hero-copy > * {
  opacity: 0;
  transform: translateY(8px);
}

.home-hero.is-visible .hero-copy > * {
  animation: hero-content-in 0.5s var(--ease-out) forwards;
}

.home-hero.is-visible .hero-copy > :nth-child(2) { animation-delay: 0.08s; }
.home-hero.is-visible .hero-copy > :nth-child(3) { animation-delay: 0.15s; }
.home-hero.is-visible .hero-copy > :nth-child(4) { animation-delay: 0.22s; }
.home-hero.is-visible .hero-copy > :nth-child(5) { animation-delay: 0.28s; }
.home-hero.is-visible .hero-copy > :nth-child(6) { animation-delay: 0.34s; }

.hero-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 32px;
}

.hero-brand img {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.hero-brand span {
  color: rgba(240, 244, 255, 0.84);
  font-size: 0.8rem;
  font-weight: 590;
  letter-spacing: 0.08em;
}

.hero-copy h1 {
  margin: 22px 0 0;
  color: var(--color-text);
  font-size: 4.5rem;
  font-weight: 510;
  letter-spacing: 0;
  line-height: 1.02;
}

.hero-copy h1 span {
  display: block;
  color: var(--color-text);
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
  min-height: 44px;
  padding: 0 16px;
  border-radius: 6px;
  font-size: 0.94rem;
  font-weight: 510;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.primary-link {
  border: 1px solid var(--color-brand);
  background: var(--color-brand);
  box-shadow: none;
  color: var(--color-text);
}

.primary-link:hover {
  background: var(--color-brand-strong);
  border-color: var(--color-brand-strong);
  color: var(--color-text);
}

.secondary-link,
.hero-github-link {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(12, 13, 14, 0.76);
  color: rgba(240, 244, 255, 0.86);
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

.hero-focus {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  margin: 34px 0 0;
  padding: 0;
  list-style: none;
}

.hero-focus li {
  color: rgba(208, 214, 224, 0.84);
  font-size: 0.9rem;
  font-weight: 510;
}

.hero-focus li::before {
  content: '';
  display: inline-block;
  width: 5px;
  height: 5px;
  margin-right: 8px;
  border-radius: 50%;
  background: var(--color-accent);
  vertical-align: 2px;
}

.about-section {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 460px);
  gap: 72px;
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
  border-radius: var(--radius-panel);
  box-shadow: var(--shadow-soft);
}

.about-image img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  min-height: 0;
  object-fit: cover;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 34px;
}

.explore-section {
  background: var(--color-bg-deep);
}

.explore-heading p {
  max-width: 440px;
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.explore-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: 1px solid var(--border-standard);
}

.explore-link {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) 24px;
  gap: 18px;
  align-items: start;
  min-height: 176px;
  padding: 30px 28px;
  border-bottom: 1px solid var(--border-standard);
  color: var(--color-text);
  transition: background-color 0.2s ease;
}

.explore-link:nth-child(odd) {
  border-right: 1px solid var(--border-standard);
}

.explore-link:hover {
  background: rgba(255, 255, 255, 0.035);
  color: var(--color-text);
}

.explore-index {
  color: var(--color-accent);
  font-size: 0.78rem;
  font-weight: 590;
}

.explore-link h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.2rem;
  font-weight: 510;
}

.explore-link p {
  margin: 10px 0 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  line-height: 1.65;
}

.explore-arrow {
  color: var(--color-text-muted);
  font-size: 1.15rem;
  transition: transform 0.2s ease, color 0.2s ease;
}

.explore-link:hover .explore-arrow {
  transform: translateX(3px);
  color: var(--color-text);
}

.explore-link h3,
.explore-index {
  transition: transform 0.25s var(--ease-spring), color 0.25s ease;
}

@media (hover: hover) and (pointer: fine) {
  .explore-link:hover h3 {
    transform: translateX(2px);
  }

  .explore-link:hover .explore-index {
    color: var(--color-accent-hover);
    transform: translateY(-1px);
  }
}

.news-section {
  background: var(--color-bg);
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.news-card {
  border: 1px solid var(--border-standard);
  border-radius: 8px;
  background: var(--color-card);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.news-card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-card);
}

.card-image-wrapper {
  overflow: hidden;
  width: 100%;
  aspect-ratio: 16 / 10;
  background: var(--color-panel);
}

.card-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

@keyframes hero-content-in {
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-copy > * {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 980px) {
  .news-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .home-hero {
    min-height: calc(100svh - 64px);
    padding: 52px 0 72px;
  }

  .hero-copy h1 {
    font-size: 3rem;
    line-height: 1.02;
  }

  .hero-description {
    font-size: 1rem;
  }

  .hero-actions,
  .hero-focus {
    justify-content: flex-start;
  }

  .hero-actions a {
    flex: 1 1 150px;
  }

  .about-section {
    grid-template-columns: minmax(0, 1fr);
    gap: 26px;
  }

  .about-image img {
    min-height: 0;
  }

  .section-heading {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 26px;
  }

  .explore-heading p {
    max-width: 34rem;
  }

  .explore-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .explore-link {
    min-height: 0;
    padding: 24px 4px;
  }

  .explore-link:nth-child(odd) {
    border-right: 0;
  }

  .news-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
  }

  .news-card-content {
    padding: 20px;
  }

  .section-title,
  .about-text h2 {
    font-size: 2.1rem;
  }
}

@media (max-width: 520px) {
  .hero-copy h1 {
    font-size: 2.35rem;
  }
}

@media (max-width: 420px) {
  .hero-brand {
    width: 100%;
    justify-content: flex-start;
  }

  .hero-focus {
    gap: 10px 14px;
  }

  .hero-focus li {
    font-size: 0.86rem;
  }
}

@media (max-height: 600px) and (max-width: 768px) {
  .home-hero {
    min-height: auto;
    padding-top: 42px;
    padding-bottom: 52px;
  }
}
</style>
