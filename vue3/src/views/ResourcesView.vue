<script setup>
import { onMounted, ref } from 'vue'
import { resources } from '../data/resourcesData.js'

const resourceList = ref(resources)

// 滚动入场动画
onMounted(() => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))
})
</script>

<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="header">
      <span class="header-bg-text">LEARN</span>
      <h1>教程与资源</h1>
      <p>我们整理的学习宝库，助你从入门到精通</p>
    </div>

    <!-- 核心内容 -->
    <div
      class="resource-section animate-on-scroll"
      v-for="section in resourceList"
      :key="section.category"
    >
      <h2>{{ section.category }}</h2>
      <p class="section-description">{{ section.description }}</p>
      <ul class="resource-grid">
        <li
          v-for="(item, index) in section.items"
          :key="item.title"
          :style="{ '--delay': `${index * 0.05}s` }"
        >
          <div class="card-content">
            <a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
            <p v-if="item.subtitle" class="subtitle">{{ item.subtitle }}</p>
            <p>{{ item.description }}</p>
          </div>
        </li>
      </ul>
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
.header p { font-size: 1.25rem; color:#6c757d; margin-top:0; animation-delay:0.2s; }

.page-container { max-width: 1100px; margin:0 auto; padding:0 20px 40px; }
.resource-section { margin-bottom: 60px; }
.section-description { font-size:1rem; color:#495057; margin-bottom:20px; }

/* 滚动动画 */
.animate-on-scroll { opacity:0; }
.animate-on-scroll.is-visible { opacity:1; }
.animate-on-scroll li {
  opacity:0;
  transform: translateY(30px);
  transition: opacity 0.5s ease-out var(--delay), transform 0.5s ease-out var(--delay);
}
.animate-on-scroll.is-visible li {
  opacity:1;
  transform: translateY(0);
}

/* 资源标题 */
.resource-section h2 { font-size: 2rem; font-weight: 300; border-bottom:1px solid #dee2e6; padding-bottom:10px; margin-bottom:30px; }

/* Grid 布局 */
.resource-grid { list-style:none; padding:0; display:grid; grid-template-columns: repeat(3, 1fr); gap:25px; }

/* 响应式 */
@media (max-width:992px) { .resource-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width:768px) {
  .header-bg-text { font-size:6rem; }
  .resource-section { margin-bottom: 42px; }
  .resource-section h2 { margin-bottom: 18px; }
  .resource-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
  }
  .card-content { padding: 20px; }
  .card-content a {
    font-size: 1.08rem;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }
}

.resource-grid li {
  background:#fff;
  border-radius:8px;
  box-shadow:0 5px 20px rgba(0,0,0,0.06);
  display:flex;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.resource-grid li:hover { transform:translateY(-6px); box-shadow:0 8px 30px rgba(0,0,0,0.1); }

.card-content { padding:25px; display:flex; flex-direction:column; width:100%; }
.card-content a { font-weight:600; font-size:1.2rem; color:#007bff; text-decoration:none; margin-bottom:10px; }
.card-content a:hover { text-decoration:underline; }
.card-content .subtitle { font-weight:500; font-size:1rem; color:#495057; margin-bottom:10px; }
.card-content p { margin:0; color:#6c757d; line-height:1.6; font-size:0.9rem; flex-grow:1; }
</style>
