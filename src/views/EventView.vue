<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRevealOnScroll } from '../composables/useRevealOnScroll.js'
import { currentEventEdition, eventEditions, getEventEditionById } from '../data/eventEditionsData.js'

import eventImg from '../assets/event/第四届萌新种子杯.jpg'
import track1Img from '../assets/event/视觉循迹仿真.gif'
import track2Img from '../assets/event/开关电源设计.jpg'
import track3Img from '../assets/event/三维建模设计.png'
import qqImg from '../assets/contact/qq群.jpg'

const route = useRoute()
const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
const track1DocUrl = assetPath('docs/event/萌新种子杯-视觉循迹仿真命题文档.pdf')
const track2DocUrl = assetPath('docs/event/萌新种子杯-开关电源设计命题文档.pdf')
const track3DocUrl = assetPath('docs/event/萌新种子杯-三维建模设计命题文档.pdf')

const edition = computed(() => {
  if (!route.params.editionId) {
    return currentEventEdition
  }

  return getEventEditionById(route.params.editionId)
})

const isFifthEdition = computed(() => edition.value?.id === '5')

useRevealOnScroll()
</script>

<template>
  <div class="page-container">
    <template v-if="edition">
      <div class="header">
        <span class="header-bg-text">EVENT</span>
        <h1>{{ edition.title }}</h1>
        <p>{{ edition.edition }} · {{ edition.status }} · 实践、创新、工程、成长</p>
      </div>

      <div class="edition-overview animate-on-scroll">
        <div class="edition-current">
          <div class="edition-title-row">
            <span class="edition-label">本届赛事</span>
            <span class="edition-status-label">{{ edition.status }}</span>
          </div>
          <strong>{{ edition.title }}</strong>
          <p>{{ edition.description }}</p>
        </div>
        <div class="edition-actions" aria-label="萌新种子杯赛事入口">
          <router-link
            v-for="item in eventEditions"
            :key="item.id"
            :to="item.route"
            class="edition-link"
            :class="{ active: item.id === edition.id }"
          >
            <span>{{ item.shortTitle }}</span>
          </router-link>
          <router-link to="/event/history" class="history-link">
            <span>往年赛事</span>
          </router-link>
        </div>
      </div>

      <template v-if="isFifthEdition">
        <div class="content-section animate-on-scroll">
          <div class="text-content animate-text">
            <h2>赛事简介</h2>
            <p>
              <strong>第五届“萌新种子杯”</strong>由<strong>工程实践创新中心</strong>主办。<br/>
              本届赛事整体规划和赛题设计由<strong>工创中心314工作室</strong>负责,
              <strong>学D317工作室</strong>协助承办开关电源设计赛道，
              <strong>机器人社</strong>提供培训支持。
            </p>
            <p>
              第五届比赛共设三个赛道：
              <a href="#track1"><strong>视觉循迹仿真赛道</strong></a>、
              <a href="#track2"><strong>开关电源设计赛道</strong></a>以及
              <a href="#track3"><strong>三维建模设计赛道</strong></a>。
            </p>
          </div>
          <div class="image-content animate-image">
            <img :src="eventImg" alt="第五届萌新种子杯赛事简介">
          </div>
        </div>

        <div id="schedule" class="content-section single-column animate-on-scroll">
          <div class="text-content animate-text">
            <h2>比赛时间</h2>
            <p>
              第五届赛事于 <strong>{{ edition.schedule }}</strong> 举行。
            </p>
            <p class="event-status">比赛已结束</p>
          </div>
        </div>

        <div id="awards" class="content-section single-column animate-on-scroll awards-section">
          <div class="text-content animate-text">
            <h2>🏆 获奖公示</h2>

            <div class="awards-card">
              <div class="awards-info">
                <p>第五届“萌新种子杯”各项赛程已圆满结束，感谢各位同学的积极参与。</p>
                <p class="highlight-notice">
                  <span class="notice-icon">📢</span>
                  荣誉证书敬请期待后续发放安排，见QQ群(455362758)通知。
                </p>
                <p>第五届最终获奖名单已整理为独立公示页面，请点击下方按钮查看：</p>
              </div>

              <router-link to="/event/5/awards" class="awards-link-btn">
                <span class="file-icon">↗</span>
                <span class="link-text">进入第五届获奖公示</span>
              </router-link>
            </div>
          </div>
        </div>

        <div class="track-container">
          <div id="track1" class="content-section animate-on-scroll">
            <div class="text-content animate-text">
              <h2>赛道一：视觉循迹仿真</h2>
              <p>
                本赛道基于 <strong>Webots</strong> 仿真平台，参赛队伍需在我们提供的仿真环境中，
                对摄像头采集的图像进行处理，并控制指定小车自主完成视觉循迹任务。<br/>
                详细任务要求和评分标准请参见
                <a :href="track1DocUrl" target="_blank" rel="noopener noreferrer">
                  《视觉循迹仿真命题文档》
                </a>。
              </p>
            </div>
            <div class="image-content animate-image">
              <img :src="track1Img" alt="视觉循迹仿真">
            </div>
          </div>

          <div id="track2" class="content-section animate-on-scroll">
            <div class="text-content animate-text">
              <h2>赛道二：开关电源设计</h2>
              <p>
                本赛道以 <strong>电力电子技术</strong> 为核心，参赛者需使用 <strong>立创EDA</strong> 及 <strong>PLECS</strong> 仿真平台，
                完成指定 <strong>DCDC 升降压变换器</strong> 与 <strong>三相逆变器</strong> 的电路设计、参数计算与仿真调试。<br/>
                详细任务要求和评分标准请参见
                <a :href="track2DocUrl" target="_blank" rel="noopener noreferrer">
                  《开关电源设计命题文档》
                </a>。
              </p>
            </div>
            <div class="image-content animate-image">
              <img :src="track2Img" alt="开关电源设计">
            </div>
          </div>

          <div id="track3" class="content-section animate-on-scroll">
            <div class="text-content animate-text">
              <h2>赛道三：三维建模设计</h2>
              <p>
                本赛道以 <strong>SolidWorks</strong> 为主要建模工具，参赛者需根据给定任务要求完成零件建模、
                装配体结构设计及自定义创新零件的设计表达。<br/>
                详细任务要求和评分标准请参见
                <a :href="track3DocUrl" target="_blank" rel="noopener noreferrer">
                  《三维建模设计命题文档》
                </a>。
              </p>
            </div>
            <div class="image-content animate-image">
              <img :src="track3Img" alt="三维建模设计">
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <section class="brief-notice animate-on-scroll">
          <div class="brief-main">
            <h2>赛事筹备中</h2>
            <p>
              第六届“萌新种子杯”正在筹备中，报名时间、赛道设置、培训安排和命题文档将陆续公布。
            </p>
          </div>
          <dl class="brief-details">
            <div>
              <dt>比赛时间</dt>
              <dd>{{ edition.schedule }}</dd>
            </div>
            <div>
              <dt>当前状态</dt>
              <dd>{{ edition.status }}</dd>
            </div>
            <div>
              <dt>咨询方式</dt>
              <dd>QQ群：455362758</dd>
            </div>
          </dl>
        </section>
      </template>

      <div v-if="isFifthEdition" id="contact" class="content-section single-column animate-on-scroll">
        <div class="text-content animate-text">
          <h2>咨询我们</h2>
          <p>QQ群：455362758</p>
        </div>
        <div class="image-content animate-image"><img :src="qqImg" class="qq-group-img" alt="萌新种子杯咨询群二维码"></div>
      </div>
    </template>

    <template v-else>
      <div class="header">
        <span class="header-bg-text">EVENT</span>
        <h1>页面未开放</h1>
        <p>该届“萌新种子杯”页面暂未开放。</p>
      </div>
      <router-link to="/event/history" class="history-link standalone-link">查看往年赛事</router-link>
    </template>
  </div>
</template>

<style scoped>
.page-container { max-width: 1000px; margin: 0 auto; padding: 0 var(--page-gutter) 30px; }

.animate-on-scroll .animate-text, .animate-on-scroll .animate-image { opacity: 0; transition: opacity 0.35s ease; }
.animate-on-scroll.is-visible .animate-text, .animate-on-scroll.is-visible .animate-image { opacity: 1; }
.animate-on-scroll.brief-notice {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.animate-on-scroll.is-visible.brief-notice {
  opacity: 1;
  transform: translateY(0);
}

.content-section { display: flex; align-items: center; gap: 20px; margin-bottom: 40px; }
.content-section[id] { scroll-margin-top: 96px; }
.text-content { flex: 0.5; }
.text-content h2 { font-size: 1.8rem; font-weight: 510; border-bottom: 1px solid var(--border-standard); padding-bottom: 4px; margin-bottom: 10px; display: inline-block; color: var(--color-text); letter-spacing: 0; }
.text-content p { line-height: 1.6; color: var(--color-text-secondary); font-size: 0.95rem; }
.text-content a { text-decoration: none; color: var(--color-accent-hover); }
.single-column { flex-direction: column; align-items: flex-start; padding: 0; }
.full-width { width: 100%; flex: none; }
.event-status {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  background: var(--color-panel);
  color: var(--color-text);
  font-size: 0.88rem;
  font-weight: 510;
}

.image-content { flex: 0.5; display: flex; justify-content: center; align-items: center; }
.image-content img { width: 100%; max-width: 600px; border-radius: 6px; box-shadow: none; }
.image-content img:hover { transform: none; }
.qq-group-img { width: 250px !important; }

.edition-overview {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 24px;
  margin: -24px 0 42px;
  padding: 14px 16px;
  border: 1px solid var(--border-standard);
  border-radius: 8px;
  background: var(--color-card);
  box-shadow: var(--shadow-card);
}

.edition-current {
  min-width: 0;
}

.edition-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.edition-label {
  color: var(--color-text-muted);
  font-size: 0.78rem;
  font-weight: 510;
}

.edition-status-label {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 8px;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  background: rgba(255, 255, 255, 0.025);
  color: var(--color-text-secondary);
  font-size: 0.76rem;
  font-weight: 510;
}

.edition-current strong {
  display: block;
  color: var(--color-text);
  font-size: 1.1rem;
  font-weight: 510;
}

.edition-current p {
  max-width: 620px;
  margin: 6px 0 0;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}

.edition-actions {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--border-standard);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.16);
}

.edition-link,
.history-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 0.88rem;
  font-weight: 510;
  white-space: nowrap;
  text-decoration: none;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.edition-link.active,
.edition-link:hover,
.history-link:hover {
  border-color: var(--border-strong);
  background: rgba(255, 255, 255, 0.055);
  color: var(--color-text);
}

.edition-link span,
.history-link span {
  color: inherit;
}

.standalone-link {
  max-width: 220px;
}

.awards-section {
  margin-top: 20px;
}

.awards-card {
  background: var(--color-card);
  border: 1px solid var(--border-standard);
  border-left: 1px solid rgba(130, 143, 255, 0.32);
  border-radius: 8px;
  padding: 25px;
  box-shadow: var(--shadow-card);
  transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}

.awards-card:hover {
  transform: none;
  border-color: var(--border-strong);
}

.awards-info p {
  margin-bottom: 12px;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.awards-info p:last-of-type {
  margin-bottom: 20px;
}

.highlight-notice {
  color: var(--color-text-secondary);
  background: rgba(113, 112, 255, 0.1);
  padding: 10px 15px;
  border-radius: 6px;
  font-weight: 510;
  display: inline-block;
  border: 1px solid rgba(130, 143, 255, 0.24);
}

.notice-icon {
  margin-right: 6px;
}

.awards-link-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
  background: var(--color-brand);
  border: 1px solid rgba(130, 143, 255, 0.6);
  color: var(--color-text);
  padding: 12px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 510;
  font-size: 1.05rem;
  transition: background-color 0.2s ease, transform 0.2s ease;
  box-shadow: none;
}

.awards-link-btn:hover {
  background: var(--color-accent-hover);
  color: var(--color-text);
  transform: none;
  text-decoration: none;
}

.file-icon {
  font-size: 1.2rem;
  margin-right: 10px;
}

.link-text {
  flex-grow: 1;
  text-align: left;
}

.brief-notice {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr);
  gap: 24px;
  align-items: start;
  margin-bottom: 44px;
  padding: 22px;
  border: 1px solid var(--border-standard);
  border-radius: 8px;
  background: var(--color-card);
  box-shadow: var(--shadow-card);
}

.brief-main h2 {
  margin: 0 0 10px;
  color: var(--color-text);
  font-size: 1.6rem;
  font-weight: 510;
  letter-spacing: 0;
}

.brief-main p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.96rem;
  line-height: 1.7;
}

.brief-details {
  display: grid;
  gap: 12px;
  margin: 0;
}

.brief-details div {
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-standard);
}

.brief-details div:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.brief-details dt {
  margin-bottom: 4px;
  color: var(--color-text-muted);
  font-size: 0.78rem;
  font-weight: 510;
}

.brief-details dd {
  margin: 0;
  color: var(--color-text);
  font-size: 0.95rem;
  font-weight: 510;
}

@media (max-width: 900px) {
  .brief-notice {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .content-section {
    flex-direction: column;
    align-items: stretch;
    gap: 24px;
  }
  .text-content,
  .image-content {
    width: 100%;
    flex: none;
  }
  .text-content p {
    line-height: 1.7;
  }
  .image-content img {
    max-width: 100%;
  }

  .edition-overview {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: -12px;
  }

  .edition-actions {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    width: 100%;
  }

  .edition-link,
  .history-link {
    min-height: 44px;
    padding: 0 8px;
    white-space: normal;
  }

  .animate-on-scroll .animate-text,
  .animate-on-scroll .animate-image {
    transform: translateY(24px);
  }

  .animate-on-scroll.is-visible .animate-text,
  .animate-on-scroll.is-visible .animate-image {
    transform: translateY(0);
  }

  .awards-card {
    padding: 20px;
  }
  
  .awards-link-btn {
    max-width: none;
    font-size: 0.95rem;
    padding: 12px 15px;
    border-radius: 8px;
    align-items: flex-start;
  }

  .qq-group-img {
    width: min(250px, 75vw) !important;
  }
}

@media (max-width: 420px) {
  .awards-card {
    padding: 16px;
  }

  .awards-link-btn {
    font-size: 0.9rem;
  }
}
</style>
