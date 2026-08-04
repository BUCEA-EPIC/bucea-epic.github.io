<script setup>
import { computed } from 'vue'
import { useRevealOnScroll } from '../composables/useRevealOnScroll.js'
import { formatDateTime, useWechatQr } from '../composables/useWechatQr.js'
import { useSiteContent } from '../composables/useSiteContent.js'

useRevealOnScroll()

const { loading, available, imageSrc, status, updatedAt } = useWechatQr()
const { content } = useSiteContent()

const wechatIntro = computed(() => {
  if (loading.value) {
    return '正在加载微信招新群二维码…'
  }
  if (available.value && imageSrc.value) {
    return content.site.wechatIntro
  }
  return '微信招新群二维码暂未发布。你也可以通过邮件与我们联系。'
})

const statusNotice = computed(() => {
  if (status.value === 'expiring') {
    return '二维码即将失效。如无法加入，请邮件联系我们。'
  }
  if (status.value === 'expired') {
    return '二维码可能已失效。如无法加入，请邮件联系我们。'
  }
  return ''
})
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
        <p class="contact-intro">{{ content.site.contactIntro }}</p>

        <dl class="contact-list">
          <div>
            <dt>工作室</dt>
            <dd>{{ content.site.address }}</dd>
          </div>
          <div>
            <dt>邮箱</dt>
            <dd>
              <a :href="`mailto:${content.site.contactEmail}`">{{ content.site.contactEmail }}</a>
            </dd>
          </div>
        </dl>
      </div>

      <div class="contact-panel">
        <div>
          <span class="contact-label">WECHAT</span>
          <h3>微信招新群</h3>
          <p>{{ wechatIntro }}</p>
          <p v-if="statusNotice" class="qr-notice" :data-status="status">{{ statusNotice }}</p>
          <p v-if="available && updatedAt" class="qr-meta">更新于 {{ formatDateTime(updatedAt) }}</p>
        </div>

        <img
          v-if="available && imageSrc"
          :src="imageSrc"
          alt="微信招新群二维码"
          class="qr-image"
          loading="lazy"
          decoding="async"
        >

        <div
          v-else
          class="qr-placeholder"
          role="img"
          aria-label="微信招新群二维码待定"
        >
          <span class="qr-placeholder-mark" aria-hidden="true"></span>
          <span class="qr-placeholder-title">{{ loading ? '加载中…' : '二维码待定' }}</span>
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
  white-space: pre-line;
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

.qr-notice {
  color: #f59e0b !important;
  font-size: 0.88rem !important;
}

.qr-notice[data-status='expired'] {
  color: #f87171 !important;
}

.qr-meta {
  color: var(--color-text-muted) !important;
  font-size: 0.82rem !important;
}

.qr-image {
  width: min(100%, 260px);
  aspect-ratio: 1;
  align-self: center;
  object-fit: contain;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  background: #fff;
  box-shadow: var(--shadow-soft);
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

  .qr-placeholder,
  .qr-image {
    width: min(240px, 74vw);
  }
}

@media (max-width: 420px) {
  .contact-info,
  .contact-panel { padding: 22px; }
  .contact-list div { grid-template-columns: minmax(0, 1fr); gap: 6px; }
}
</style>
