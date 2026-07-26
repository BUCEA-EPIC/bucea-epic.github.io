<script setup>
import { computed } from 'vue'
import { eventEditions } from '../data/eventEditionsData.js'
import { useRevealOnScroll } from '../composables/useRevealOnScroll.js'

const pastEditions = computed(() =>
  eventEditions.filter((edition) => edition.status === '已结束')
)

const upcomingEditions = computed(() =>
  eventEditions.filter((edition) => edition.status !== '已结束')
)

useRevealOnScroll()
</script>

<template>
  <div class="page-container">
    <div class="header">
      <span class="header-bg-text">EVENTS</span>
      <h1>往年赛事</h1>
      <p>查看历届“萌新种子杯”的赛事信息、赛道内容与公示结果</p>
    </div>

    <section class="history-section animate-on-scroll">
      <div class="section-heading">
        <h2>已结束赛事</h2>
        <p>这里收录已经完成的“萌新种子杯”赛事。</p>
      </div>

      <div class="edition-grid">
        <article
          v-for="edition in pastEditions"
          :key="edition.id"
          class="edition-card"
        >
          <div>
            <span class="edition-status">{{ edition.status }}</span>
            <h3>{{ edition.title }}</h3>
            <p>{{ edition.description }}</p>
          </div>

          <div class="card-actions">
            <router-link :to="edition.route">查看赛事</router-link>
            <router-link
              v-if="edition.awardsRoute"
              :to="edition.awardsRoute"
            >
              获奖公示
            </router-link>
          </div>
        </article>
      </div>
    </section>

    <section
      v-if="upcomingEditions.length"
      class="history-section animate-on-scroll"
    >
      <div class="section-heading">
        <h2>后续赛事</h2>
        <p>后续届次会在筹备过程中持续更新赛事安排。</p>
      </div>

      <div class="edition-grid">
        <article
          v-for="edition in upcomingEditions"
          :key="edition.id"
          class="edition-card upcoming"
        >
          <div>
            <span class="edition-status">{{ edition.status }}</span>
            <h3>{{ edition.title }}</h3>
            <p>{{ edition.description }}</p>
          </div>

          <div class="card-actions">
            <router-link :to="edition.route">查看赛事</router-link>
          </div>
        </article>
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

.history-section {
  margin-bottom: 72px;
}

.section-heading {
  display: grid;
  grid-template-columns: minmax(240px, 0.7fr) minmax(0, 1fr);
  gap: 48px;
  align-items: end;
  margin-bottom: 26px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-standard);
}

.section-heading h2 {
  margin: 0;
  color: var(--color-text);
  font-size: 2rem;
  font-weight: 510;
  letter-spacing: 0;
}

.section-heading p {
  max-width: 620px;
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.edition-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.edition-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 250px;
  padding: 26px;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-card);
  background: var(--color-card);
  box-shadow: none;
  transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.edition-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-strong);
  background: var(--color-card-hover);
  box-shadow: var(--shadow-card);
}

.edition-card.upcoming {
  border-top-color: rgba(141, 152, 216, 0.6);
}

.edition-status {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 0 9px;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  color: var(--color-text-muted);
  font-size: 0.78rem;
  font-weight: 510;
}

.edition-card h3 {
  margin: 14px 0 10px;
  color: var(--color-text);
  font-size: 1.45rem;
  font-weight: 510;
}

.edition-card p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.94rem;
  line-height: 1.7;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}

.card-actions a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  background: rgba(255, 255, 255, 0.025);
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  font-weight: 510;
  text-decoration: none;
}

.card-actions a:hover {
  border-color: var(--border-strong);
  background: rgba(255, 255, 255, 0.045);
  color: var(--color-text);
}

@media (max-width: 768px) {
  .page-container {
    padding-bottom: 40px;
  }

  .edition-grid {
    grid-template-columns: 1fr;
  }

  .section-heading {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }

  .edition-card {
    min-height: 0;
    padding: 22px;
  }
}
</style>
