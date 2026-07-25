<script setup>
import { projects } from '../data/projectsData.js'
import { useRevealOnScroll } from '../composables/useRevealOnScroll.js'

useRevealOnScroll()

// 点击卡片打开链接
function handleCardClick(url) {
  if (url && url !== '#') {
    window.open(url, '_blank', 'noopener noreferrer')
  } else {
    alert('该项目暂无资料哦，敬请期待！ (づ ●─● )づ')
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
        :class="{ 'reverse-layout': index % 2 !== 0 }"
      >
        <div class="card-image">
          <img :src="project.image" :alt="project.title" />
        </div>
        <div class="card-content">
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
          <div class="tags">
            <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container { max-width: 1100px; margin: 0 auto; padding: 0 var(--page-gutter) 40px; }

.projects-list { display: flex; flex-direction: column; gap: 32px; opacity: 0; transition: opacity 0.35s ease; }
.projects-list.is-visible { opacity: 1; }

.project-card { background: var(--color-card); border: 1px solid var(--border-standard); border-radius: 6px; overflow: hidden; box-shadow: none; display: flex; align-items: center; cursor: pointer; transition: border-color 0.2s ease, background-color 0.2s ease; }
.project-card:hover { border-color: var(--border-strong); background: var(--color-card-hover); }
.project-card.reverse-layout { flex-direction: row-reverse; }

.card-image { flex-basis: 45%; flex-shrink: 0; overflow: hidden; display: flex; align-items: center; justify-content: center; height: 300px; }
.card-image img { width: 100%; height: 100%; object-fit: cover; display: block; }

.card-content { flex: 1; padding: 40px; display: flex; flex-direction: column; }
.card-content h3 { margin-top: 0; color: var(--color-text); font-size: 1.8rem; font-weight: 510; letter-spacing: 0; }
.card-content p { color: var(--color-text-secondary); flex-grow: 1; line-height: 1.7; }
.tags { margin-top: 20px; }
.tag { display: inline-block; background: rgba(255, 255, 255, 0.04); color: var(--color-text-secondary); padding: 5px 10px; border: 1px solid var(--border-standard); border-radius: var(--radius-control); font-size: 0.8rem; font-weight: 510; margin-right: 8px; margin-bottom: 8px; }

@media (max-width: 768px) {
  .project-card, .project-card.reverse-layout { flex-direction: column; }
  .card-image { flex-basis: auto; width: 100%; height: auto; aspect-ratio: 16 / 10; }
  .projects-list { gap: 24px; }
  .card-content { padding: 22px; }
  .card-content h3 {
    font-size: 1.35rem;
    line-height: 1.3;
  }
  .card-content p {
    line-height: 1.65;
  }
}

@media (max-width: 420px) {
  .card-content { padding: 18px; }
}
</style>
