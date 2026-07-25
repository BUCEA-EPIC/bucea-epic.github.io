<script setup>
import { advisors, coreTeam } from '../data/teamData.js'
import { useRevealOnScroll } from '../composables/useRevealOnScroll.js'

const leader = coreTeam.find((member) => member.name === '蔡思瑶')
const members = coreTeam.filter((member) => member.name !== leader?.name)

useRevealOnScroll('.team-reveal')
</script>

<template>
  <div class="page-container">
    <div class="header">
      <span class="header-bg-text">TEAM</span>
      <h1>团队成员</h1>
      <p>简单、清晰地展示当前团队结构</p>
    </div>

    <section class="team-block advisor-section team-reveal">
      <div class="block-heading">
        <span class="eyebrow">Advisors</span>
        <h2>指导老师</h2>
      </div>

      <div class="advisor-list">
        <div class="advisor-card" v-for="advisor in advisors" :key="advisor.name">
          <div class="advisor-portrait">
            <img :src="advisor.avatar" :alt="advisor.name">
          </div>
          <div class="advisor-info">
            <span class="advisor-label">Faculty Advisor</span>
            <h3>{{ advisor.name }}</h3>
            <p class="advisor-role">{{ advisor.role }}</p>
            <p class="advisor-bio">{{ advisor.bio }}</p>
          </div>
        </div>
      </div>
    </section>

    <div class="team-layout team-reveal">
      <section class="team-block leader-block">
        <div class="block-heading">
          <span class="eyebrow">Lead</span>
          <h2>主要负责人</h2>
        </div>

        <div class="leader-card" v-if="leader">
          <div class="leader-portrait">
            <img :src="leader.avatar" :alt="leader.name">
          </div>
          <div class="leader-info">
            <span class="leader-label">Current Lead</span>
            <h3>{{ leader.name }}</h3>
            <p class="leader-role">{{ leader.role }}</p>
            <p class="leader-bio">{{ leader.bio }}</p>
            <div class="leader-tags" aria-label="负责人信息">
              <span>团队统筹</span>
              <span>赛事组织</span>
              <span>项目协作</span>
            </div>
          </div>
        </div>
      </section>

      <section class="team-block">
        <div class="block-heading">
          <span class="eyebrow">Members</span>
          <h2>成员</h2>
        </div>

        <div class="member-grid">
          <div
            class="member-card"
            v-for="member in members"
            :key="member.name"
          >
            <div class="member-avatar">
              <img :src="member.avatar" :alt="member.name">
            </div>
            <div class="member-content">
              <span class="member-label">Member</span>
              <h3>{{ member.name }}</h3>
              <p class="member-role">{{ member.role || '成员' }}</p>
              <p class="member-bio" v-if="member.bio">{{ member.bio }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 var(--page-gutter) 56px;
}

.team-reveal {
  opacity: 0;
  transition: opacity 0.35s ease;
}

.team-reveal.is-visible {
  opacity: 1;
}

.advisor-section {
  margin-bottom: 54px;
}

.advisor-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.team-layout {
  --member-photo-width: 320px;
  --member-photo-aspect: 3 / 4;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.team-block {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.block-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--border-standard);
  padding-bottom: 12px;
}

.block-heading h2 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.45rem;
  font-weight: 510;
  letter-spacing: 0;
}

.eyebrow {
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 590;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.advisor-card,
.leader-card,
.member-card {
  background: var(--color-card);
  border: 1px solid var(--border-standard);
  border-radius: 8px;
  box-shadow: var(--shadow-card);
}

.advisor-card,
.leader-card {
  position: relative;
  display: grid;
  grid-template-columns: minmax(240px, var(--member-photo-width)) minmax(0, 1fr);
  align-items: stretch;
  gap: 36px;
  overflow: hidden;
  padding: 32px;
  background: var(--color-card);
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.advisor-card {
  grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
}

.advisor-card:hover,
.leader-card:hover {
  border-color: var(--border-strong);
  background: var(--color-card-hover);
}

.advisor-card::before,
.leader-card::before {
  content: none;
}

.advisor-portrait,
.leader-portrait {
  position: relative;
  z-index: 1;
  width: 100%;
  aspect-ratio: var(--member-photo-aspect);
  overflow: hidden;
  border: 1px solid var(--border-standard);
  border-radius: 8px;
  background: var(--color-panel);
  box-shadow: none;
}

.advisor-portrait img,
.leader-portrait img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 38%;
}

.advisor-portrait img {
  object-position: center 18%;
}

.advisor-info,
.leader-info {
  position: relative;
  z-index: 1;
  align-self: center;
  min-width: 0;
  padding-right: 20px;
}

.advisor-label,
.leader-label {
  display: inline-flex;
  margin-bottom: 18px;
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 590;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.advisor-card h3,
.leader-card h3 {
  margin: 0 0 14px;
  color: var(--color-text);
  font-size: 2.5rem;
  font-weight: 510;
  letter-spacing: 0;
  line-height: 1.1;
}

.advisor-card h3 {
  font-size: 2.5rem;
}

.advisor-card p,
.leader-card p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 1rem;
}

.advisor-card .advisor-role,
.leader-card .leader-role {
  margin-bottom: 12px;
  color: var(--color-text-secondary);
  font-size: 1.05rem;
  font-weight: 590;
}

.advisor-card .advisor-bio,
.leader-card .leader-bio {
  max-width: 520px;
  line-height: 1.6;
}

.advisor-card .advisor-bio {
  white-space: pre-wrap;
  word-break: break-word;
}

.leader-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 26px;
}

.leader-tags span {
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  padding: 7px 12px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--color-text-secondary);
  font-size: 0.85rem;
}

.member-grid {
  column-count: 3;
  column-gap: 18px;
}

.member-card {
  position: relative;
  display: inline-block;
  width: 100%;
  min-width: 0;
  margin: 0 0 18px;
  overflow: hidden;
  break-inside: avoid;
  background: var(--color-card);
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.member-card:hover {
  border-color: var(--border-strong);
  background: var(--color-card-hover);
}

.member-card::before {
  content: none;
}

.member-avatar {
  position: relative;
  z-index: 1;
  width: 100%;
  overflow: hidden;
  border-bottom: 1px solid var(--border-standard);
  background: var(--color-panel);
}

.member-avatar img {
  display: block;
  width: 100%;
  height: auto;
}

.member-content {
  position: relative;
  z-index: 1;
  min-width: 0;
  padding: 18px 18px 20px;
}

.member-label {
  display: inline-flex;
  margin-bottom: 12px;
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 590;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.member-card h3 {
  margin: 0 0 12px;
  color: var(--color-text);
  font-size: 2rem;
  font-weight: 510;
  letter-spacing: 0;
  line-height: 1.05;
}

.member-card p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 1rem;
}

.member-card .member-role {
  margin-bottom: 10px;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  font-weight: 590;
}

.member-card .member-bio {
  max-width: none;
  line-height: 1.6;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

@media (max-width: 980px) {
  .member-grid {
    column-count: 2;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding-bottom: 40px;
  }

  .team-layout {
    gap: 32px;
  }

  .advisor-section {
    margin-bottom: 42px;
  }

  .block-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }

  .member-grid {
    column-count: 1;
  }

  .member-card {
    margin-bottom: 16px;
  }

  .member-avatar {
    width: 100%;
  }

  .member-card h3 {
    font-size: 1.8rem;
  }

  .advisor-card,
  .leader-card {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
    padding: 20px;
  }

  .advisor-portrait,
  .leader-portrait {
    width: min(100%, 320px);
    margin: 0 auto;
  }

  .advisor-info,
  .leader-info {
    padding-right: 0;
  }

  .advisor-card h3,
  .leader-card h3 {
    font-size: 2.6rem;
    overflow-wrap: anywhere;
  }

  .leader-tags {
    margin-top: 20px;
  }
}
</style>
