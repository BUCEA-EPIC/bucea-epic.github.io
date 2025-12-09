<script setup>
import { onMounted } from 'vue'

// 图片引用（Vite 支持通过 import 直接引入）
import studio1Img from '../assets/about/工作室1.jpg'
import studio2Img from '../assets/about/工作室2.jpg'

// 滚动动画
onMounted(() => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible')
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))
})
</script>

<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="header">
      <span class="header-bg-text">ABOUT</span>
      <h1>关于我们</h1>
      <p>探索、创造、协作、成长</p>
    </div>

    <!-- 核心内容 -->
    <div class="content-section animate-on-scroll">
      <div class="text-content animate-text">
        <h2>工作室简介</h2>
        <p>
          <strong>314工作室</strong>诞生于2013年，是在<strong>工程实践创新中心</strong>专业指导下成立的多学科交叉学术科技团队。我们虽然年轻，但充满活力与雄心，致力于成为校园内前沿技术探索与创新项目孵化的先锋力量。
        </p>
        <p>
          依托工程实践创新中心强大的平台资源与开放的学术氛围，我们专注于将<strong>机械、电子、控制与计算机视觉等多学科知识深度融合</strong>，并应用到机器人系统的设计与开发中。在这里，每一位成员都有机会参与从创意构思到原型实现的全链路项目实践，将课堂理论转化为看得见的、具备应用价值的创新成果。
        </p>
      </div>
      <div class="image-content animate-image">
        <img :src="studio1Img" alt="工作室">
      </div>
    </div>

    <div class="content-section reverse animate-on-scroll">
      <div class="text-content animate-text">
        <h2>我们的使命与愿景</h2>
        <p>
          <strong>使命:</strong> 我们致力于搭建一个开放、协作的技术交流平台，激发成员的创新潜能，培养具备卓越工程实践能力、团队协作精神与解决复杂问题能力的未来工程师。
        </p>
        <p>
          <strong>愿景:</strong> 成为连接校园与前沿机器人领域的桥梁，让每一位成员都能在这里找到自己的热爱，用代码和机械构筑未来，成长为具备核心竞争力的创新型人才。
        </p>
      </div>
      <div class="image-content animate-image">
        <img :src="studio2Img" alt="我们的使命">
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 页面头部 */
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.header { text-align: center; padding: 60px 20px; margin-bottom: 60px; position: relative; overflow: hidden; }
.header-bg-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 10rem; font-weight: 900; color: rgba(0, 0, 0, 0.04); z-index: 1; user-select: none; white-space: nowrap; }
.header h1, .header p { position: relative; z-index: 2; animation: fadeInUp 0.8s ease-out forwards; }
.header h1 { font-size: 3.5rem; font-weight: 300; margin-bottom: 20px; }
.header h1::after { content: ''; display: block; width: 60px; height: 4px; background-color: #007bff; margin: 20px auto 0; }
.header p { font-size: 1.25rem; color: #6c757d; margin-top: 0; animation-delay: 0.2s; }

/* 页面容器 */
.page-container { max-width: 1100px; margin: 0 auto; padding: 0 20px 40px; }

/* 滚动动画 */
.animate-on-scroll .animate-text,
.animate-on-scroll .animate-image {
  opacity: 0;
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}
.animate-on-scroll .animate-text { transform: translateX(-50px); }
.animate-on-scroll .animate-image { transform: translateX(50px); }

.content-section.reverse .animate-text { transform: translateX(50px); }
.content-section.reverse .animate-image { transform: translateX(-50px); }

.animate-on-scroll.is-visible .animate-text,
.animate-on-scroll.is-visible .animate-image {
  opacity: 1;
  transform: translateX(0);
}
.animate-on-scroll.is-visible .animate-image { transition-delay: 0.2s; }

/* 核心内容布局 */
.content-section { display: flex; align-items: center; gap: 50px; margin-bottom: 100px; }
.content-section.reverse { flex-direction: row-reverse; }

.text-content { flex: 1; }
.text-content h2 { font-size: 2rem; font-weight: 300; border-bottom: 2px solid #007bff; padding-bottom: 10px; margin-bottom: 20px; display: inline-block; }
.text-content p { line-height: 1.8; color: #495057; }

.image-content { flex: 1; }
.image-content img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}
.image-content img:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .header-bg-text { font-size: 6rem; }
  .content-section, .content-section.reverse { flex-direction: column; gap: 40px; }
  .animate-on-scroll .animate-text,
  .animate-on-scroll .animate-image,
  .content-section.reverse .animate-text,
  .content-section.reverse .animate-image { transform: translateY(50px); }
  .animate-on-scroll.is-visible .animate-text,
  .animate-on-scroll.is-visible .animate-image { transform: translateY(0); }
}
</style>
