<script setup>
import { ref } from 'vue'
import { awardsData } from '../data/awardsData.js'
import { useRevealOnScroll } from '../composables/useRevealOnScroll.js'

// 使用 ref 保存数据
const awards = ref(awardsData)

useRevealOnScroll('.award-section')
</script>

<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="header">
      <span class="header-bg-text">AWARDS</span>
      <h1>赛事与荣誉</h1>
      <p>每一步前行，都闪耀着智慧与汗水的光芒</p>
    </div>

    <!-- 核心内容区域 -->
    <div class="awards-container">
      <section
        class="award-section animate-on-scroll"
        v-for="yearEntry in awards"
        :key="yearEntry.year"
      >
        <h2>{{ yearEntry.year }}</h2>
        <div class="awards-grid">
          <div
            class="award-card"
            v-for="(award, index) in yearEntry.items"
            :key="index"
            :style="{ 'animation-delay': `${index * 0.05}s` }"
          >
            <div class="card-image">
              <img :src="award.image" :alt="award.competition" />
            </div>
            <div class="card-content">
              <h3 class="award-name">{{ award.name }}</h3>
              <p class="competition">{{ award.competition }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.page-container { max-width:1200px; margin:0 auto; padding:0 20px 40px; }

.award-section { margin-bottom: 60px; opacity:0; transform: translateY(50px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
.award-section.is-visible { opacity:1; transform: translateY(0); }
.award-section h2 { font-size: 2.2rem; font-weight:510; border-bottom:1px solid var(--border-standard); padding-bottom:15px; margin-bottom:30px; color: var(--color-text); letter-spacing: -0.704px; }

.awards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:30px; }

.award-card { background:var(--color-card); border:1px solid var(--border-standard); border-radius:8px; box-shadow:var(--shadow-card); overflow:hidden; display:flex; flex-direction:column; transform: translateY(0); transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease; }
.award-card:hover { transform: translateY(-4px); border-color:var(--border-strong); background:var(--color-card-hover); }

.card-image { width:100%; height:220px; overflow:hidden; background:var(--color-panel); }
.card-image img { width:100%; height:100%; object-fit:contain; transition: transform 0.25s ease-out; }
.award-card:hover .card-image img { transform: scale(1.1); }

.card-content { padding:20px; display:flex; flex-direction:column; flex-grow:1; }
.award-name { font-size:1.3rem; font-weight:590; color:var(--color-text); margin:0 0 10px; flex-grow:1; }
.competition { font-size:0.9rem; color:var(--color-text-secondary); line-height:1.5; margin:0; }

@media (max-width:768px) {
  .award-section { margin-bottom: 42px; }
  .award-section h2 { margin-bottom: 20px; }
  .awards-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }
  .card-image { height: 190px; }
  .card-content { padding: 18px; }
  .award-name {
    font-size: 1.15rem;
    line-height: 1.35;
  }
}
</style>
