<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getEventEditionById } from '../data/eventEditionsData.js'
import { useRevealOnScroll } from '../composables/useRevealOnScroll.js'

const route = useRoute()
const edition = computed(() => getEventEditionById(route.params.editionId))

useRevealOnScroll()
</script>

<template>
  <div class="page-container">
    <template v-if="edition">
      <div class="header">
        <span class="header-bg-text">EVENT</span>
        <h1>{{ edition.title }}</h1>
        <p>{{ edition.edition }} · {{ edition.status }} · {{ edition.schedule }}</p>
      </div>

      <section class="edition-hero animate-on-scroll">
        <div>
          <router-link to="/event" class="back-link">返回第五届</router-link>
          <h2>{{ edition.status }}</h2>
          <p>{{ edition.description }}</p>
        </div>
        <div class="edition-meta" aria-label="赛事信息">
          <div>
            <strong>{{ edition.edition }}</strong>
            <span>当前届次</span>
          </div>
          <div>
            <strong>{{ edition.status }}</strong>
            <span>赛事状态</span>
          </div>
          <div>
            <strong>{{ edition.schedule }}</strong>
            <span>比赛时间</span>
          </div>
        </div>
      </section>

      <section class="edition-section animate-on-scroll">
        <div class="section-heading">
          <span>赛事概览</span>
          <h2>赛事信息</h2>
        </div>
        <div class="info-grid">
          <article
            v-for="section in edition.sections"
            :key="section.title"
            class="info-card"
          >
            <h3>{{ section.title }}</h3>
            <p>{{ section.content }}</p>
          </article>
        </div>
      </section>

      <section class="edition-section animate-on-scroll">
        <div class="section-heading">
          <span>赛道安排</span>
          <h2>赛道设置</h2>
        </div>
        <div class="track-grid">
          <article
            v-for="(track, index) in edition.tracks"
            :key="track"
            class="track-card"
          >
            <small>赛道 {{ index + 1 }}</small>
            <h3>{{ track }}</h3>
            <p>具体赛题、规则和命题文档将在赛事启动后公布。</p>
          </article>
        </div>
      </section>

      <section class="edition-section animate-on-scroll">
        <div class="section-heading">
          <span>参赛流程</span>
          <h2>赛事流程</h2>
        </div>
        <ol class="timeline">
          <li
            v-for="item in edition.timeline"
            :key="item"
          >
            {{ item }}
          </li>
        </ol>
      </section>
    </template>

    <template v-else>
      <div class="header">
        <span class="header-bg-text">EVENT</span>
        <h1>页面未开放</h1>
        <p>该届“萌新种子杯”页面暂未开放。</p>
      </div>
      <router-link to="/event" class="back-link">返回萌新种子杯</router-link>
    </template>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 20px 48px;
}

.animate-on-scroll {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.edition-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.8fr);
  gap: 28px;
  align-items: start;
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border-standard);
}

.back-link {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 10px;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  background: rgba(255, 255, 255, 0.025);
  color: var(--color-text-secondary);
  font-size: 0.88rem;
  font-weight: 510;
  text-decoration: none;
}

.back-link:hover {
  border-color: var(--border-strong);
  background: rgba(255, 255, 255, 0.045);
  color: var(--color-text);
}

.edition-hero h2,
.section-heading h2 {
  margin: 14px 0 12px;
  color: var(--color-text);
  font-size: 2rem;
  font-weight: 510;
  letter-spacing: -0.704px;
}

.edition-hero p,
.info-card p,
.track-card p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.7;
}

.edition-meta {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.edition-meta div,
.info-card,
.track-card,
.timeline li {
  border: 1px solid var(--border-standard);
  border-radius: 8px;
  background: var(--color-card);
  box-shadow: var(--shadow-card);
}

.edition-meta div {
  min-height: 76px;
  padding: 16px;
}

.edition-meta strong {
  display: block;
  color: var(--color-text);
  font-size: 1.28rem;
  font-weight: 510;
  line-height: 1.2;
}

.edition-meta span,
.section-heading span,
.track-card small {
  display: block;
  margin-top: 8px;
  color: var(--color-text-muted);
  font-size: 0.8rem;
  font-weight: 510;
}

.edition-section {
  margin-bottom: 48px;
}

.section-heading {
  margin-bottom: 18px;
}

.section-heading h2 {
  margin-top: 6px;
}

.info-grid,
.track-grid {
  display: grid;
  gap: 16px;
}

.info-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.track-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.info-card,
.track-card {
  padding: 18px;
}

.info-card h3,
.track-card h3 {
  margin: 0 0 10px;
  color: var(--color-text);
  font-size: 1.08rem;
  font-weight: 510;
}

.track-card small {
  margin: 0 0 8px;
}

.timeline {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: step;
}

.timeline li {
  position: relative;
  min-height: 96px;
  padding: 42px 14px 14px;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
  counter-increment: step;
}

.timeline li::before {
  content: counter(step);
  position: absolute;
  top: 14px;
  left: 14px;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border: 1px solid var(--border-standard);
  border-radius: 50%;
  color: var(--color-text-muted);
  font-size: 0.76rem;
}

@media (max-width: 920px) {
  .edition-hero,
  .info-grid,
  .track-grid,
  .timeline {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 0 0 40px;
  }
}
</style>
