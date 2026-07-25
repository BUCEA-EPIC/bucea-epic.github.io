<script setup>
import qqImage from '../assets/contact/qq群.jpg' // Vite 推荐导入图片
import { useRevealOnScroll } from '../composables/useRevealOnScroll.js'

useRevealOnScroll()
</script>

<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="header">
      <span class="header-bg-text">CONTACT</span>
      <h1>联系我们</h1>
      <p>期待与你交流，无论是技术探讨还是合作意向</p>
    </div>

    <!-- 核心内容 -->
    <div class="contact-content animate-on-scroll">
      <div class="contact-info">
        <span class="contact-label">VISIT</span>
        <h2>来工作室聊聊</h2>
        <p class="contact-intro">技术交流、项目协作或加入团队，都可以通过下面的方式找到我们。</p>

        <dl class="contact-list">
          <div>
            <dt>实验室</dt>
            <dd>北京建筑大学大兴校区<br>工程实践创新中心 317 室</dd>
          </div>
          <div>
            <dt>QQ群</dt>
            <dd>455362758</dd>
          </div>
        </dl>
      </div>

      <div class="qq-group">
        <div>
          <span class="contact-label">JOIN</span>
          <h3>加入交流群</h3>
          <p>使用 QQ 扫码，获取活动通知并与成员交流。</p>
        </div>
        <img :src="qqImage" alt="QQ群455362758二维码" class="qq-image" loading="lazy" decoding="async">
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1040px;
  margin: 0 auto;
  padding: 0 var(--page-gutter) 64px;
}

.contact-content.animate-on-scroll {
  opacity: 0;
  transition: opacity 0.35s ease;
}

.contact-content.animate-on-scroll.is-visible {
  opacity: 1;
}

.contact-content {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(300px, 0.9fr);
  gap: 0;
  background: var(--color-card);
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-panel);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.contact-info {
  padding: 46px;
}

.contact-label {
  display: block;
  margin-bottom: 14px;
  color: var(--color-accent);
  font-size: 0.74rem;
  font-weight: 590;
  letter-spacing: 0.12em;
}

.contact-info h2,
.qq-group h3 {
  margin: 0;
  color: var(--color-text);
  font-weight: 510;
}

.contact-info h2 {
  font-size: 2.25rem;
  line-height: 1.15;
}

.contact-intro {
  max-width: 490px;
  margin: 18px 0 0;
  line-height: 1.75;
}

.contact-list {
  display: grid;
  margin: 34px 0 0;
  border-top: 1px solid var(--border-standard);
}

.contact-list div {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 18px;
  padding: 20px 0;
  border-bottom: 1px solid var(--border-standard);
}

.contact-list dt {
  color: var(--color-text-muted);
  font-size: 0.85rem;
  font-weight: 510;
}

.contact-list dd {
  margin: 0;
  color: var(--color-text);
  line-height: 1.7;
}

.qq-group {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 28px;
  padding: 46px;
  border-left: 1px solid var(--border-standard);
  background: var(--color-bg-deep);
}

.qq-group h3 {
  font-size: 1.4rem;
}

.qq-group p {
  margin: 12px 0 0;
  color: var(--color-text-secondary);
  font-size: 0.92rem;
  line-height: 1.7;
}

.qq-group .qq-image {
  width: min(100%, 260px);
  aspect-ratio: 1;
  align-self: center;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  box-shadow: var(--shadow-soft);
}

@media (max-width: 860px) {
  .contact-content {
    grid-template-columns: minmax(0, 1fr);
  }

  .contact-info,
  .qq-group {
    padding: 28px;
  }

  .qq-group {
    border-top: 1px solid var(--border-standard);
    border-left: 0;
  }

  .contact-info h2 {
    font-size: 1.8rem;
  }

  .qq-group .qq-image {
    width: min(240px, 74vw);
  }
}

@media (max-width: 420px) {
  .contact-info,
  .qq-group { padding: 22px; }
  .contact-list div { grid-template-columns: minmax(0, 1fr); gap: 6px; }
}
</style>
