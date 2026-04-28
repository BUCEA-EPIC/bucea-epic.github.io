<script setup>
import { onMounted, ref } from 'vue'
import { awardsData } from '../data/awardsData.js'

// 使用 ref 保存数据
const awards = ref(awardsData)

// 滚动入场动画
onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        }
      })
    },
    { threshold: 0.1 }
  )

  document.querySelectorAll('.award-section').forEach(el => observer.observe(el))
})
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
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.header { text-align: center; padding: 60px 20px; margin-bottom: 40px; position: relative; overflow: hidden; }
.header-bg-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 10rem; font-weight: 900; color: rgba(0,0,0,0.04); z-index: 1; user-select: none; white-space: nowrap; }
.header h1, .header p { position: relative; z-index: 2; animation: fadeInUp 0.8s ease-out forwards; }
.header h1 { font-size: 3.5rem; font-weight: 300; margin-bottom: 20px; }
.header h1::after { content: ''; display: block; width: 60px; height: 4px; background-color: #007bff; margin: 20px auto 0; }
.header p { font-size: 1.25rem; color:#6c757d; margin-top:0; animation-delay:0.2s; }

.page-container { max-width:1200px; margin:0 auto; padding:0 20px 40px; }

.award-section { margin-bottom: 60px; opacity:0; transform: translateY(50px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
.award-section.is-visible { opacity:1; transform: translateY(0); }
.award-section h2 { font-size: 2.2rem; font-weight:300; border-bottom:1px solid #dee2e6; padding-bottom:15px; margin-bottom:30px; }

.awards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:30px; }

.award-card { background:#fff; border-radius:8px; box-shadow:0 5px 25px rgba(0,0,0,0.08); overflow:hidden; display:flex; flex-direction:column; transform: translateY(0); transition: transform 0.25s ease-out, box-shadow 0.25s ease-out; }
.award-card:hover { transform: translateY(-10px); box-shadow:0 10px 30px rgba(0,0,0,0.15); }

.card-image { width:100%; height:220px; overflow:hidden; background-color:#f8f9fa; }
.card-image img { width:100%; height:100%; object-fit:contain; transition: transform 0.25s ease-out; }
.award-card:hover .card-image img { transform: scale(1.1); }

.card-content { padding:20px; display:flex; flex-direction:column; flex-grow:1; }
.award-name { font-size:1.3rem; font-weight:600; color:#212529; margin:0 0 10px; flex-grow:1; }
.competition { font-size:0.9rem; color:#6c757d; line-height:1.5; margin:0; }

@media (max-width:768px) {
  .header-bg-text { font-size:6rem; }
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
