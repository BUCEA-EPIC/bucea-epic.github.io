<script setup>
import { useRevealOnScroll } from '../composables/useRevealOnScroll.js'

// 图片引用（Vite 支持通过 import 直接引入）
import studio1Img from '../assets/about/工作室1.jpg'
import studio2Img from '../assets/about/工作室2.jpg'

useRevealOnScroll()
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
          <strong>317工作室</strong>诞生于2013年，是在<strong>工程实践创新中心</strong>专业指导下成立的多学科交叉学术科技团队。我们虽然年轻，但充满活力与雄心，致力于成为校园内前沿技术探索与创新项目孵化的先锋力量。
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
.text-content h2 { font-size: 2rem; font-weight: 510; border-bottom: 1px solid var(--border-standard); padding-bottom: 10px; margin-bottom: 20px; display: inline-block; color: var(--color-text); letter-spacing: -0.704px; }
.text-content p { line-height: 1.8; color: var(--color-text-secondary); }

.image-content { flex: 1; }
.image-content img {
  width: 100%;
  border-radius: 8px;
  border: 1px solid var(--border-standard);
  box-shadow: var(--shadow-soft);
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.image-content img:hover {
  transform: translateY(-4px);
  border-color: var(--border-strong);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .content-section, .content-section.reverse {
    flex-direction: column;
    gap: 24px;
    margin-bottom: 48px;
  }
  .text-content,
  .image-content {
    width: 100%;
  }
  .text-content p {
    line-height: 1.7;
  }
  .animate-on-scroll .animate-text,
  .animate-on-scroll .animate-image,
  .content-section.reverse .animate-text,
  .content-section.reverse .animate-image { transform: translateY(50px); }
  .animate-on-scroll.is-visible .animate-text,
  .animate-on-scroll.is-visible .animate-image { transform: translateY(0); }
}
</style>
