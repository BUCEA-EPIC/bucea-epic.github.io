<script setup>
import { onMounted } from 'vue'
import { projects } from '../data/projectsData.js'

// 滚动入场动画
onMounted(() => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible')
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))
})

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
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.header { text-align: center; padding: 60px 20px; margin-bottom: 40px; position: relative; overflow: hidden; }
.header-bg-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 10rem; font-weight: 900; color: rgba(0, 0, 0, 0.04); z-index: 1; user-select: none; white-space: nowrap; }
.header h1, .header p { position: relative; z-index: 2; animation: fadeInUp 0.8s ease-out forwards; }
.header h1 { font-size: 3.5rem; font-weight: 300; margin-bottom: 20px; }
.header h1::after { content: ''; display: block; width: 60px; height: 4px; background-color: #007bff; margin: 20px auto 0; }
.header p { font-size: 1.25rem; color: #6c757d; margin-top: 0; animation-delay: 0.2s; }

.page-container { max-width: 1100px; margin: 0 auto; padding: 0 20px 40px; }

.projects-list { display: flex; flex-direction: column; gap: 50px; opacity: 0; transform: translateY(50px); filter: blur(5px); transition: opacity 0.8s ease-out, transform 0.8s ease-out, filter 0.8s ease-out; }
.projects-list.is-visible { opacity: 1; transform: translateY(0); filter: blur(0); }

.project-card { background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 5px 25px rgba(0,0,0,0.08); display: flex; align-items: center; cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease; }
.project-card:hover { transform: translateY(-10px); box-shadow: 0 10px 30px rgba(0,0,0,0.12); }
.project-card.reverse-layout { flex-direction: row-reverse; }

.card-image { flex-basis: 45%; flex-shrink: 0; overflow: hidden; display: flex; align-items: center; justify-content: center; height: 300px; }
.card-image img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
.project-card:hover .card-image img { transform: scale(1.05); }

.card-content { flex: 1; padding: 40px; display: flex; flex-direction: column; }
.card-content h3 { margin-top: 0; color: #343a40; font-size: 1.8rem; }
.card-content p { color: #495057; flex-grow: 1; line-height: 1.7; }
.tags { margin-top: 20px; }
.tag { display: inline-block; background-color: #e9ecef; color: #495057; padding: 5px 12px; border-radius: 15px; font-size: 0.8rem; margin-right: 8px; margin-bottom: 8px; }

@media (max-width: 768px) {
  .project-card, .project-card.reverse-layout { flex-direction: column; }
  .card-image { flex-basis: auto; width: 100%; height: 220px; }
  .header-bg-text { font-size: 6rem; }
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
  .card-image { height: 190px; }
  .card-content { padding: 18px; }
}
</style>
