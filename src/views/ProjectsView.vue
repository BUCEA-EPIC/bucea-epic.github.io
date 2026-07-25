<script setup>
import { projects } from '../data/projectsData.js'
import { useRevealOnScroll } from '../composables/useRevealOnScroll.js'

useRevealOnScroll()

// 点击卡片打开链接
function handleCardClick(url) {
  if (url && url !== '#') {
    window.open(url, '_blank', 'noopener noreferrer')
  } else {
    alert('该项目资料正在整理中，敬请期待。')
  }
}
</script>

<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="header">
      <span class="header-bg-text">WORKS</span>
      <h1>项目与机器人</h1>
      <p>我们的智慧结晶与得意之作</p>
    </div>

    <div class="projects-list animate-on-scroll">
      <div
        class="project-card"
        v-for="(project, index) in projects"
        :key="project.title"
        @click="handleCardClick(project.url)"
        @keydown.enter="handleCardClick(project.url)"
        @keydown.space.prevent="handleCardClick(project.url)"
        :class="{ 'reverse-layout': index % 2 !== 0 }"
        role="link"
        tabindex="0"
        :aria-label="`${project.title}，${project.url === '#' ? '资料整理中' : '打开项目资料'}`"
      >
        <div class="card-image">
          <img :src="project.image" :alt="project.title" loading="lazy" decoding="async" />
        </div>
        <div class="card-content">
          <span class="project-index">PROJECT 0{{ index + 1 }}</span>
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
          <div class="tags">
            <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <span class="project-action">
            {{ project.url === '#' ? '资料整理中' : '查看开源项目' }}
            <span v-if="project.url !== '#'" aria-hidden="true">↗</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container { max-width: var(--container); margin: 0 auto; padding: 0 var(--page-gutter) 64px; }

.projects-list { display: flex; flex-direction: column; gap: 28px; opacity: 0; transition: opacity 0.35s ease; }
.projects-list.is-visible { opacity: 1; }

.project-card { min-height: 390px; background: var(--color-card); border: 1px solid var(--border-standard); border-radius: var(--radius-card); overflow: hidden; box-shadow: none; display: flex; align-items: stretch; cursor: pointer; transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease; }
.project-card:hover { transform: translateY(-2px); border-color: var(--border-strong); background: var(--color-card-hover); box-shadow: var(--shadow-card); }
.project-card.reverse-layout { flex-direction: row-reverse; }

.card-image { flex-basis: 52%; flex-shrink: 0; overflow: hidden; display: flex; align-items: center; justify-content: center; min-height: 390px; }
.card-image img { width: 100%; height: 100%; object-fit: cover; display: block; }

.card-content { flex: 1; padding: 44px; display: flex; flex-direction: column; justify-content: center; }
.project-index { margin-bottom: 16px; color: var(--color-accent); font-size: 0.74rem; font-weight: 590; letter-spacing: 0.1em; }
.card-content h3 { margin: 0; color: var(--color-text); font-size: 1.85rem; font-weight: 510; letter-spacing: 0; line-height: 1.25; }
.card-content p { color: var(--color-text-secondary); flex-grow: 1; line-height: 1.7; }
.tags { margin-top: 20px; }
.tag { display: inline-block; background: rgba(255, 255, 255, 0.04); color: var(--color-text-secondary); padding: 5px 10px; border: 1px solid var(--border-standard); border-radius: var(--radius-control); font-size: 0.8rem; font-weight: 510; margin-right: 8px; margin-bottom: 8px; }
.project-action { display: inline-flex; align-items: center; gap: 6px; margin-top: 18px; color: var(--color-text-muted); font-size: 0.88rem; font-weight: 510; }
.project-card:hover .project-action { color: var(--color-text); }

@media (max-width: 900px) {
  .project-card, .project-card.reverse-layout { flex-direction: column; }
  .project-card { min-height: 0; }
  .card-image { flex-basis: auto; width: 100%; min-height: 0; height: auto; aspect-ratio: 16 / 10; }
  .projects-list { gap: 24px; }
  .card-content { padding: 26px 22px; }
  .card-content h3 {
    font-size: 1.35rem;
    line-height: 1.3;
  }
  .card-content p {
    line-height: 1.65;
  }
}

@media (max-width: 420px) {
  .card-content { padding: 24px 18px; }
}
</style>
