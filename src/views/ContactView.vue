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
        <h3>联系信息</h3>
        <p><strong><i class="icon">📍</i> 实验室地址:</strong><br>北京建筑大学大兴校区工程实践创新中心317室</p>

        <!-- 居中图片和文字 -->
        <div class="qq-group">
          <p>扫码下方二维码加入我们的QQ群<br/>群号：455362758</p>
          <img :src="qqImage" alt="QQ群二维码" class="qq-image">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 页面容器 */
.page-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 var(--page-gutter) 40px;
}

/* 滚动入场动画 */
.contact-content.animate-on-scroll {
  opacity: 0;
  transition: opacity 0.35s ease;
}

.contact-content.animate-on-scroll.is-visible {
  opacity: 1;
}

/* 联系内容布局 */
.contact-content {
  max-width: 680px;
  margin: 0 auto;
  background: var(--color-card);
  border: 1px solid var(--border-standard);
  padding: 40px;
  border-radius: 6px;
  box-shadow: none;
}

.contact-info h3 {
  font-size: 1.5rem;
  font-weight: 510;
  border-bottom: 1px solid var(--border-standard);
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.contact-info p {
  line-height: 1.8;
  color: var(--color-text-secondary);
  overflow-wrap: anywhere;
}

.contact-info .icon {
  display: inline-block;
  width: 20px;
  color: var(--color-accent-hover);
}

/* QQ群居中样式 */
.qq-group {
  text-align: center;
  margin-top: 20px;
}

.qq-group p {
  margin-bottom: 15px;
  font-size: 1rem;
  color: var(--color-text-secondary);
}

.qq-group .qq-image {
  width: 40%;
  max-width: 400px;
  border-radius: 6px;
  border: 1px solid var(--border-standard);
  box-shadow: none;
  transition: border-color 0.2s ease;
  cursor: pointer;
}

.qq-group .qq-image:hover {
  border-color: var(--border-strong);
}

/* 响应式 */
@media (max-width: 768px) {
  .contact-content {
    padding: 22px;
  }

  .qq-group .qq-image {
    width: min(220px, 75vw);
  }

  .contact-info h3 {
    font-size: 1.3rem;
  }
}

@media (max-width: 420px) {
  .contact-content {
    padding: 18px;
  }
}
</style>
