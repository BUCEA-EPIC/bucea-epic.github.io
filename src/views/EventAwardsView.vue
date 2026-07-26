<script setup>
import { computed } from 'vue'
import { awardTracks } from '../data/awardsData.js'
import { getEventEditionById } from '../data/eventEditionsData.js'
import { QQ_GROUP } from '../data/siteInfo.js'
import { useRevealOnScroll } from '../composables/useRevealOnScroll.js'

// 本页面路由固定为 /event/5/awards，届次信息按 id 取，避免「当前届次」变更后串届
const edition = getEventEditionById('5')

const trackTotal = (track) =>
  track.groups.reduce((sum, group) => sum + group.entries.length, 0)

const awardTotal = computed(() =>
  awardTracks.reduce((sum, track) => sum + trackTotal(track), 0)
)

const levelSummary = computed(() => {
  const totals = new Map()

  awardTracks.forEach((track) => {
    track.groups.forEach((group) => {
      totals.set(group.level, (totals.get(group.level) ?? 0) + group.entries.length)
    })
  })

  return Array.from(totals, ([level, count]) => ({ level, count }))
})

useRevealOnScroll()
</script>

<template>
  <div class="page-container">
    <header class="header">
      <span class="header-bg-text">AWARDS</span>
      <h1>第五届获奖公示</h1>
      <p>第五届“萌新种子杯”最终获奖名单</p>
    </header>

    <section class="notice-summary animate-on-scroll">
      <div class="summary-copy">
        <router-link to="/event/5" class="back-link">返回第五届</router-link>
        <h2>{{ edition?.title || '第五届萌新种子杯' }}公示名单</h2>
        <p>第五届各项赛程已圆满结束，以下名单按赛道与奖项分组展示。荣誉证书发放安排请关注 QQ 群（{{ QQ_GROUP }}）通知。</p>
      </div>

      <div class="summary-grid" role="group" aria-label="获奖统计">
        <div class="summary-item">
          <strong>{{ awardTracks.length }}</strong>
          <span>赛道</span>
        </div>
        <div class="summary-item">
          <strong>{{ awardTotal }}</strong>
          <span>获奖人次</span>
        </div>
        <div
          v-for="item in levelSummary"
          :key="item.level"
          class="summary-item"
        >
          <strong>{{ item.count }}</strong>
          <span>{{ item.level }}</span>
        </div>
      </div>
    </section>

    <section
      v-for="track in awardTracks"
      :key="track.name"
      class="notice-track animate-on-scroll"
    >
      <div class="track-heading">
        <div>
          <span class="track-label">赛道</span>
          <h2>{{ track.name }}</h2>
        </div>
        <span class="track-total">{{ trackTotal(track) }} 人次</span>
      </div>

      <div class="level-grid">
        <section
          v-for="group in track.groups"
          :key="group.level"
          class="level-card"
        >
          <div class="level-heading">
            <h3>{{ group.level }}</h3>
            <span>{{ group.entries.length }} 人</span>
          </div>

          <table class="award-table" :aria-label="`${track.name} · ${group.level} 获奖名单`">
            <thead>
              <tr>
                <th scope="col">队伍编号</th>
                <th scope="col">姓名</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="entry in group.entries"
                :key="`${track.name}-${group.level}-${entry.teamNo}-${entry.name}`"
              >
                <td>{{ entry.teamNo }}</td>
                <td>{{ entry.name }}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-container {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--page-gutter) 48px;
}

.notice-summary {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.8fr);
  gap: 56px;
  align-items: start;
  margin-bottom: 64px;
  padding-bottom: 44px;
  border-bottom: 1px solid var(--border-standard);
}

.summary-copy h2 {
  margin: 14px 0 12px;
  color: var(--color-text);
  font-size: 2rem;
  font-weight: 510;
  letter-spacing: 0;
}

.summary-copy p {
  max-width: 680px;
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 1rem;
  line-height: 1.7;
}

.back-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  background: rgba(255, 255, 255, 0.025);
  color: var(--color-text-secondary);
  font-size: 0.88rem;
  font-weight: 510;
  text-decoration: none;
}

.back-link:hover {
  border-color: var(--border-strong);
  background: rgba(255, 255, 255, 0.045);
  color: var(--color-text);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.summary-item {
  min-height: 84px;
  padding: 16px;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-card);
  background: var(--color-card);
  box-shadow: none;
}

.summary-item strong {
  display: block;
  color: var(--color-text);
  font-size: 1.8rem;
  font-weight: 510;
  line-height: 1;
}

.summary-item span {
  display: block;
  margin-top: 8px;
  color: var(--color-text-muted);
  font-size: 0.86rem;
}

.notice-track {
  margin-bottom: 64px;
}

.track-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 22px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-standard);
}

.track-label {
  display: block;
  margin-bottom: 6px;
  color: var(--color-text-muted);
  font-size: 0.78rem;
  font-weight: 510;
}

.track-heading h2 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.65rem;
  font-weight: 510;
  letter-spacing: 0;
}

.track-total {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  color: var(--color-text-muted);
  font-size: 0.82rem;
}

.level-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  align-items: start;
}

.level-card {
  overflow: hidden;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-card);
  background: var(--color-card);
  box-shadow: none;
}

.level-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 14px;
  border-bottom: 1px solid var(--border-standard);
  background: rgba(255, 255, 255, 0.025);
}

.level-heading h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 510;
}

.level-heading span {
  color: var(--color-text-muted);
  font-size: 0.82rem;
}

.award-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.award-table th,
.award-table td {
  padding: 9px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.055);
  text-align: left;
  vertical-align: middle;
}

.award-table th {
  color: var(--color-text-muted);
  font-size: 0.78rem;
  font-weight: 510;
}

.award-table td {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  word-break: keep-all;
}

.award-table th:first-child,
.award-table td:first-child {
  width: 38%;
  color: var(--color-text-muted);
}

.award-table tr:last-child td {
  border-bottom: 0;
}

.award-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.035);
}

@media (max-width: 980px) {
  .level-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .notice-summary {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding-bottom: 40px;
  }

  .notice-summary {
    margin-bottom: 36px;
    padding-bottom: 26px;
  }

  .track-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .level-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 420px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .summary-item {
    min-height: 76px;
    padding: 14px 12px;
  }

  .award-table th,
  .award-table td {
    padding: 9px 12px;
  }
}
</style>
