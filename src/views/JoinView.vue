<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { SITE_LOGO } from '../data/siteInfo.js'
import { formatDateTime, useWechatQr } from '../composables/useWechatQr.js'
import { useSiteContent } from '../composables/useSiteContent.js'

const { loading, error, available, imageSrc, status, updatedAt, load } = useWechatQr()
const { content } = useSiteContent()

const lightboxOpen = ref(false)
const imageFailed = ref(false)
const closeButton = ref(null)

const contactEmail = computed(() => content.site.contactEmail)
const updatedLabel = computed(() =>
  updatedAt.value ? `最近更新于 ${formatDateTime(updatedAt.value)}` : ''
)
const statusNotice = computed(() => {
  if (status.value === 'expiring') return '二维码即将失效，请尽快完成入群。'
  if (status.value === 'expired') return '二维码可能已失效，请联系管理员获取最新入群方式。'
  return ''
})

function openLightbox() {
  if (available.value && imageSrc.value && !imageFailed.value) {
    lightboxOpen.value = true
  }
}

function closeLightbox() {
  lightboxOpen.value = false
}

function handleKeydown(event) {
  if (event.key === 'Escape' && lightboxOpen.value) {
    closeLightbox()
  }
}

function handleImageError() {
  imageFailed.value = true
  closeLightbox()
}

async function retry() {
  imageFailed.value = false
  await load()
}

watch(imageSrc, () => {
  imageFailed.value = false
})

watch(lightboxOpen, async (open) => {
  if (open) {
    await nextTick()
    closeButton.value?.focus()
  }
})

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div class="join-page">
    <div class="join-grid" aria-hidden="true"></div>
    <div class="join-glow join-glow-primary" aria-hidden="true"></div>
    <div class="join-glow join-glow-secondary" aria-hidden="true"></div>

    <main class="join-shell">
      <header class="join-header">
        <router-link to="/" class="join-brand" aria-label="返回光启 Ray-space 工作室首页">
          <img :src="SITE_LOGO" alt="" aria-hidden="true">
          <span>光启 Ray-space 工作室</span>
        </router-link>
        <span class="join-header-label">WECHAT GROUP</span>
      </header>

      <section class="join-card" aria-labelledby="join-title">
        <div class="join-card-copy">
          <span class="join-eyebrow">RAY-SPACE / WELCOME</span>
          <h1 id="join-title">加入微信招新群</h1>
          <p>获取最新活动通知，与工作室成员交流，开始你的工程实践之旅。</p>
        </div>

        <div class="join-qr-section">
          <template v-if="available && imageSrc && !imageFailed">
            <button
              type="button"
              class="join-qr-button"
              aria-label="点击放大微信招新群二维码"
              @click="openLightbox"
            >
              <span class="join-qr-frame">
                <img
                  :src="imageSrc"
                  alt="微信招新群二维码"
                  class="join-qr-image"
                  decoding="async"
                  @error="handleImageError"
                >
              </span>
            </button>
            <p class="join-qr-hint">长按二维码识别 · 点击查看大图</p>
          </template>

          <div v-else class="join-qr-state" role="status" aria-live="polite">
            <span v-if="loading" class="join-spinner" aria-hidden="true"></span>
            <span v-else class="join-state-mark" aria-hidden="true">!</span>
            <strong>{{ loading ? '正在加载二维码' : '二维码暂时不可用' }}</strong>
            <p>
              {{ loading ? '请稍候，正在获取最新招新群图片。' : (error || '当前暂无可用的招新群二维码。') }}
            </p>
            <button v-if="!loading" type="button" class="join-retry" @click="retry">
              重新加载
            </button>
          </div>
        </div>

        <div class="join-card-meta">
          <span v-if="updatedLabel">{{ updatedLabel }}</span>
          <span v-if="statusNotice" class="join-status-notice" :data-status="status">
            {{ statusNotice }}
          </span>
        </div>
      </section>

      <footer class="join-footer">
        <p>
          如二维码无法加入，请联系
          <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
        </p>
        <router-link to="/" class="join-home-link">
          返回官网
          <span aria-hidden="true">→</span>
        </router-link>
      </footer>
    </main>

    <div
      v-if="lightboxOpen"
      class="join-lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-lightbox-title"
      @click.self="closeLightbox"
    >
      <div class="join-lightbox-panel">
        <div class="join-lightbox-toolbar">
          <strong id="join-lightbox-title">微信招新群二维码</strong>
          <button
            ref="closeButton"
            type="button"
            class="join-lightbox-close"
            aria-label="关闭二维码大图"
            @click="closeLightbox"
          >
            ×
          </button>
        </div>
        <img
          :src="imageSrc"
          alt="微信招新群二维码大图"
          class="join-lightbox-image"
          decoding="async"
          @error="handleImageError"
        >
        <p>长按图片识别二维码，加入微信群</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.join-page {
  position: relative;
  display: flex;
  min-height: 100svh;
  overflow: hidden;
  isolation: isolate;
  background:
    radial-gradient(circle at 50% 0%, rgba(90, 102, 173, 0.16), transparent 34rem),
    var(--color-bg-deep);
}

.join-grid,
.join-glow {
  position: absolute;
  pointer-events: none;
}

.join-grid {
  inset: 0;
  z-index: -2;
  opacity: 0.28;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(to bottom, black, transparent 78%);
}

.join-glow {
  z-index: -1;
  width: 22rem;
  height: 22rem;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.18;
}

.join-glow-primary {
  top: 12%;
  left: -12rem;
  background: var(--color-brand);
}

.join-glow-secondary {
  right: -12rem;
  bottom: 8%;
  background: var(--color-accent);
}

.join-shell {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: min(100%, 560px);
  margin: 0 auto;
  padding: 28px var(--page-gutter) 26px;
}

.join-header,
.join-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.join-header {
  min-height: 42px;
}

.join-brand {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  gap: 10px;
  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 510;
}

.join-brand:hover {
  color: var(--color-text);
}

.join-brand img {
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
  border: 1px solid var(--border-standard);
  border-radius: 5px;
  background: #fff;
  object-fit: cover;
}

.join-header-label,
.join-eyebrow {
  color: var(--color-text-muted);
  font-size: 0.7rem;
  font-weight: 590;
  letter-spacing: 0.12em;
}

.join-header-label {
  white-space: nowrap;
}

.join-card {
  width: 100%;
  margin: auto 0;
  padding: clamp(30px, 7vw, 52px) clamp(22px, 7vw, 52px) 24px;
  border: 1px solid var(--border-standard);
  border-radius: 18px;
  background: rgba(18, 20, 21, 0.84);
  box-shadow: var(--shadow-soft), inset 0 1px 0 rgba(255, 255, 255, 0.035);
  backdrop-filter: blur(18px);
}

.join-card-copy {
  text-align: center;
}

.join-eyebrow {
  display: block;
  color: var(--color-accent);
}

.join-card h1 {
  margin: 16px 0 0;
  color: var(--color-text);
  font-size: clamp(2rem, 7vw, 2.9rem);
  font-weight: 510;
  letter-spacing: -0.04em;
  line-height: 1.08;
}

.join-card-copy p {
  max-width: 360px;
  margin: 16px auto 0;
  color: var(--color-text-secondary);
  font-size: 0.96rem;
  line-height: 1.7;
}

.join-qr-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
}

.join-qr-button {
  display: block;
  width: min(100%, 320px);
  padding: 0;
  border: 0;
  border-radius: 12px;
  background: transparent;
  cursor: zoom-in;
}

.join-qr-frame {
  display: block;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 20px 42px rgba(0, 0, 0, 0.28);
  transition: transform 0.25s var(--ease-out), box-shadow 0.25s ease;
}

.join-qr-button:hover .join-qr-frame,
.join-qr-button:focus-visible .join-qr-frame {
  transform: translateY(-2px);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.36);
}

.join-qr-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
}

.join-qr-hint {
  margin: 14px 0 0;
  color: var(--color-text-muted);
  font-size: 0.82rem;
  text-align: center;
}

.join-qr-state {
  display: flex;
  min-height: 320px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: min(100%, 320px);
  padding: 28px;
  border: 1px dashed var(--border-strong);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.025);
  text-align: center;
}

.join-qr-state strong {
  margin-top: 16px;
  color: var(--color-text);
  font-size: 1rem;
}

.join-qr-state p {
  margin: 8px 0 0;
  color: var(--color-text-muted);
  font-size: 0.84rem;
  line-height: 1.6;
}

.join-spinner,
.join-state-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
}

.join-spinner {
  border: 2px solid var(--border-standard);
  border-top-color: var(--color-accent);
  animation: join-spin 0.8s linear infinite;
}

.join-state-mark {
  border: 1px solid rgba(245, 158, 11, 0.48);
  color: #fbbf24;
  font-size: 1.2rem;
  font-weight: 590;
}

.join-retry {
  min-height: 40px;
  margin-top: 18px;
  padding: 0 16px;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  background: rgba(255, 255, 255, 0.04);
  color: var(--color-text-secondary);
  cursor: pointer;
}

.join-retry:hover {
  border-color: var(--border-strong);
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-text);
}

.join-card-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 14px;
  margin-top: 20px;
  color: var(--color-text-subtle);
  font-size: 0.75rem;
  text-align: center;
}

.join-status-notice[data-status='expiring'] {
  color: #fbbf24;
}

.join-status-notice[data-status='expired'] {
  color: #f87171;
}

.join-footer {
  margin-top: 24px;
  color: var(--color-text-subtle);
  font-size: 0.78rem;
}

.join-footer p {
  margin: 0;
  line-height: 1.6;
}

.join-footer p a {
  color: var(--color-text-secondary);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.join-home-link {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 7px;
  min-height: 40px;
  color: var(--color-text-secondary);
  font-weight: 510;
  white-space: nowrap;
}

.join-home-link span {
  color: var(--color-accent);
  transition: transform 0.2s var(--ease-out);
}

.join-home-link:hover span {
  transform: translateX(3px);
}

.join-lightbox {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(2, 3, 4, 0.88);
  backdrop-filter: blur(10px);
}

.join-lightbox-panel {
  position: relative;
  width: min(100%, 520px);
  padding: 18px;
  border: 1px solid var(--border-standard);
  border-radius: 14px;
  background: var(--color-panel);
  box-shadow: var(--shadow-soft);
}

.join-lightbox-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 16px;
}

.join-lightbox-toolbar strong {
  color: var(--color-text);
  font-size: 0.92rem;
  font-weight: 510;
}

.join-lightbox-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-standard);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  color: var(--color-text-secondary);
  font-size: 1.45rem;
  line-height: 1;
  cursor: pointer;
}

.join-lightbox-close:hover {
  border-color: var(--border-strong);
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-text);
}

.join-lightbox-image {
  width: 100%;
  max-height: min(70svh, 600px);
  border-radius: 8px;
  background: #fff;
  object-fit: contain;
}

.join-lightbox-panel p {
  margin: 14px 0 0;
  color: var(--color-text-muted);
  font-size: 0.8rem;
  text-align: center;
}

@keyframes join-spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 540px) {
  .join-shell {
    padding: 18px 18px 20px;
  }

  .join-header-label {
    display: none;
  }

  .join-card {
    margin: 28px 0 auto;
    padding: 30px 18px 22px;
    border-radius: 14px;
  }

  .join-qr-section {
    margin-top: 26px;
  }

  .join-qr-state {
    min-height: 72vw;
  }

  .join-footer {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
    margin-top: 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .join-spinner {
    animation: none;
  }

  .join-qr-frame,
  .join-home-link span {
    transition: none;
  }
}
</style>
