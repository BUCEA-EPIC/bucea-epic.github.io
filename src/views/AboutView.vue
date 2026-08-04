<script setup>
import { useRevealOnScroll } from '../composables/useRevealOnScroll.js'

// 图片引用（Vite 支持通过 import 直接引入）
import studio1Img from '../assets/about/studio-1.webp'
import studio2Img from '../assets/about/studio-2.webp'

useRevealOnScroll()
</script>

<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <header class="header">
      <span class="header-bg-text">ABOUT</span>
      <h1>关于我们</h1>
      <p>探索、创造、协作、成长</p>
    </header>

    <!-- 核心内容 -->
    <section class="content-section animate-on-scroll">
      <div class="text-content animate-text">
        <span class="section-index">01 / ORIGIN</span>
        <h2>工作室简介</h2>
        <p>
          <strong>光启 Ray-space 工作室</strong>的历史最早可以追溯到 2013 年。作为在<strong>工程实践创新中心</strong>指导下建设的多学科交叉学术科技团队，我们持续开展前沿技术探索与工程项目实践。
        </p>
        <p>
          依托工程实践创新中心的平台资源与开放氛围，我们将<strong>机械、电子、控制与计算机视觉等知识融合</strong>到机器人系统设计与开发中。成员可以参与从问题定义、方案设计到原型实现的完整项目流程，把课堂知识转化为可验证、可迭代的工程成果。
        </p>
      </div>
      <div class="image-content animate-image">
        <img :src="studio1Img" alt="光启 Ray-space 工作室环境" loading="lazy" decoding="async">
      </div>
    </section>

    <section class="content-section reverse animate-on-scroll">
      <div class="text-content animate-text">
        <span class="section-index">02 / MISSION</span>
        <h2>我们的使命与愿景</h2>
        <p>
          <strong>使命：</strong>搭建开放、协作的技术交流平台，培养成员的工程实践能力、团队协作能力与复杂问题解决能力。
        </p>
        <p>
          <strong>愿景：</strong>连接校园学习与机器人领域实践，让成员在真实项目中找到兴趣、积累经验并持续成长。
        </p>
      </div>
      <div class="image-content animate-image">
        <img :src="studio2Img" alt="工作室成员开展工程实践" loading="lazy" decoding="async">
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 页面容器 */
.page-container { max-width: var(--container); margin: 0 auto; padding: 0 var(--page-gutter) 56px; }

/* 滚动动画：基础显隐规则在全局 styles/main.css，此处控制子元素随外层入场 */
.animate-on-scroll .animate-text,
.animate-on-scroll .animate-image {
  opacity: 0;
  transition: opacity 0.35s ease;
}

.animate-on-scroll.is-visible .animate-text,
.animate-on-scroll.is-visible .animate-image {
  opacity: 1;
}

/* 核心内容布局 */
.content-section {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 0.88fr);
  align-items: center;
  gap: 80px;
  margin-bottom: 120px;
}
.content-section.reverse { grid-template-columns: minmax(360px, 0.88fr) minmax(0, 1fr); }
.content-section.reverse .text-content { order: 2; }
.content-section.reverse .image-content { order: 1; }

.section-index {
  display: block;
  margin-bottom: 14px;
  color: var(--color-accent);
  font-size: 0.76rem;
  font-weight: 590;
  letter-spacing: 0.1em;
}
.text-content h2 { margin: 0 0 24px; border: 0; padding: 0; font-size: 2.25rem; font-weight: 510; color: var(--color-text); letter-spacing: 0; }
.text-content p { margin: 0 0 18px; line-height: 1.82; color: var(--color-text-secondary); }
.text-content p:last-child { margin-bottom: 0; }

.image-content { position: relative; }
.image-content img {
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-panel);
  border: 1px solid var(--border-standard);
  box-shadow: var(--shadow-soft);
  transition: border-color 0.2s ease;
  object-fit: cover;
}
.image-content img:hover {
  border-color: var(--border-strong);
}

/* 移动端适配 */
@media (max-width: 900px) {
  .content-section, .content-section.reverse {
    grid-template-columns: minmax(0, 1fr);
    gap: 30px;
    margin-bottom: 64px;
  }
  .content-section.reverse .text-content,
  .content-section.reverse .image-content { order: initial; }
  .text-content,
  .image-content {
    width: 100%;
  }
  .text-content p {
    line-height: 1.7;
  }

  .text-content h2 { font-size: 1.8rem; }
}
</style>
