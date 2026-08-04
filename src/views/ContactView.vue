<script setup>
import { CONTACT_EMAIL } from '../data/siteInfo.js'
import { useRevealOnScroll } from '../composables/useRevealOnScroll.js'

useRevealOnScroll()
</script>

<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <header class="header">
      <span class="header-bg-text">CONTACT</span>
      <h1>联系我们</h1>
      <p>期待与你交流，无论是技术探讨还是合作意向</p>
    </header>

    <!-- 核心内容 -->
    <div class="contact-content animate-on-scroll">
      <div class="contact-info">
        <span class="contact-label">VISIT</span>
        <h2>来工作室聊聊</h2>
        <p class="contact-intro">技术交流、项目协作或加入团队，都可以通过下面的方式找到我们。</p>

        <dl class="contact-list">
          <div>
            <dt>工作室</dt>
            <dd>北京建筑大学大兴校区<br>工程实践创新中心 322 室</dd>
          </div>
          <div>
            <dt>邮箱</dt>
            <dd>
              <a :href="`mailto:${CONTACT_EMAIL}`">{{ CONTACT_EMAIL }}</a>
            </dd>
          </div>
        </dl>
      </div>

      <div class="contact-panel">
        <div>
          <span class="contact-label">WECHAT</span>
          <h3>微信招新群</h3>
          <p>使用微信扫码加入招新群，获取活动通知并与成员交流。二维码将在后续更新。</p>
        </div>
        <div
          class="qr-placeholder"
          role="img"
          aria-label="微信招新群二维码待定"
        >
          <span class="qr-placeholder-mark" aria-hidden="true"></span>
          <span class="qr-placeholder-title">二维码待定</span>
          <span class="qr-placeholder-hint">微信招新群</span>
        </div>
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
.contact-panel h3 {
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

.contact-list a {
  color: var(--color-accent-hover);
  font-weight: 510;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.contact-list a:hover {
  color: var(--color-text);
}

.contact-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 28px;
  padding: 46px;
  border-left: 1px solid var(--border-standard);
  background: var(--color-bg-deep);
}

.contact-panel h3 {
  font-size: 1.4rem;
}

.contact-panel p {
  margin: 12px 0 0;
  color: var(--color-text-secondary);
  font-size: 0.92rem;
  line-height: 1.7;
}

.qr-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: min(100%, 260px);
  aspect-ratio: 1;
  align-self: center;
  padding: 20px;
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius-control);
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 55%),
    var(--color-card);
  box-shadow: var(--shadow-soft);
  text-align: center;
}

.qr-placeholder-mark {
  width: 56px;
  height: 56px;
  margin-bottom: 4px;
  border: 2px solid var(--color-text-muted);
  border-radius: 6px;
  opacity: 0.55;
  background:
    linear-gradient(to right, transparent 46%, var(--color-text-muted) 46%, var(--color-text-muted) 54%, transparent 54%),
    linear-gradient(to bottom, transparent 46%, var(--color-text-muted) 46%, var(--color-text-muted) 54%, transparent 54%);
  background-size: 100% 100%;
  box-shadow:
    inset 10px 10px 0 -8px var(--color-text-muted),
    inset -10px -10px 0 -8px var(--color-text-muted);
}

.qr-placeholder-title {
  color: var(--color-text);
  font-size: 0.98rem;
  font-weight: 590;
}

.qr-placeholder-hint {
  color: var(--color-text-muted);
  font-size: 0.82rem;
  letter-spacing: 0.04em;
}

@media (max-width: 900px) {
  .contact-content {
    grid-template-columns: minmax(0, 1fr);
  }

  .contact-info,
  .contact-panel {
    padding: 28px;
  }

  .contact-panel {
    border-top: 1px solid var(--border-standard);
    border-left: 0;
  }

  .contact-info h2 {
    font-size: 1.8rem;
  }

  .qr-placeholder {
    width: min(240px, 74vw);
  }
}

@media (max-width: 420px) {
  .contact-info,
  .contact-panel { padding: 22px; }
  .contact-list div { grid-template-columns: minmax(0, 1fr); gap: 6px; }
}
</style>
