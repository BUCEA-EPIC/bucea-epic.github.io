<script setup>
import { advisors } from '../data/teamData.js'

const memberSlots = Array.from({ length: 6 }, (_, index) => index + 1)
</script>

<template>
  <div class="page-container">
    <div class="header">
      <span class="header-bg-text">TEAM</span>
      <h1>团队成员</h1>
      <p>简单、清晰地展示当前团队结构</p>
    </div>

    <section class="advisor-section">
      <h2>指导老师</h2>
      <div class="advisor-grid">
        <div class="team-card" v-for="advisor in advisors" :key="advisor.name">
          <div class="image-wrapper-advisor">
            <img :src="advisor.avatar" :alt="advisor.name">
          </div>
          <div class="card-info">
            <h3>{{ advisor.name }}</h3>
            <p class="role">{{ advisor.role }}</p>
            <p class="bio">{{ advisor.bio }}</p>
          </div>
        </div>
      </div>
    </section>

    <div class="team-layout">
      <section class="team-block">
        <div class="block-heading">
          <span class="eyebrow">Lead</span>
          <h2>主要负责人</h2>
        </div>

        <div class="leader-card">
          <div>
            <h3>蔡思瑶</h3>
            <p>主要负责人</p>
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
            v-for="slot in memberSlots"
            :key="slot"
          >
            <span>成员 {{ slot }}</span>
            <strong>待添加</strong>
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
  padding: 0 20px 56px;
}

.header {
  text-align: center;
  padding: 60px 20px;
  margin-bottom: 34px;
  position: relative;
  overflow: hidden;
}

.header-bg-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10rem;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.04);
  z-index: 1;
  user-select: none;
  white-space: nowrap;
}

.header h1,
.header p {
  position: relative;
  z-index: 2;
}

.header h1 {
  font-size: 3.5rem;
  font-weight: 300;
  margin-bottom: 20px;
}

.header h1::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background-color: #007bff;
  margin: 20px auto 0;
}

.header p {
  font-size: 1.25rem;
  color: #6c757d;
  margin-top: 0;
}

.advisor-section {
  margin-bottom: 54px;
}

.advisor-section h2 {
  margin: 0 0 32px;
  color: var(--color-text);
  font-size: 2rem;
  font-weight: 510;
  letter-spacing: -0.704px;
  text-align: center;
}

.advisor-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
}

.advisor-grid .team-card {
  width: min(430px, 100%);
  flex-shrink: 0;
}

.team-card {
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid var(--border-standard);
  border-radius: 8px;
  box-shadow: var(--shadow-card);
  text-align: center;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.team-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 22px 68px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.055);
}

.team-card img {
  transition: transform 0.3s ease;
}

.team-card:hover img {
  transform: scale(1.05);
}

.image-wrapper-advisor {
  width: 100%;
  height: 500px;
  overflow: hidden;
  background: var(--color-panel);
  border-bottom: 1px solid var(--border-subtle);
}

.image-wrapper-advisor img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-info {
  padding: 20px;
}

.card-info h3 {
  margin: 0 0 5px;
  color: var(--color-text);
  font-size: 1.3rem;
  font-weight: 510;
}

.card-info .role {
  color: var(--color-accent-hover);
  margin: 0 0 10px;
  font-size: 0.9rem;
  font-weight: 590;
}

.card-info .bio {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  line-height: 1.65;
  white-space: pre-wrap;
  word-break: break-word;
}

.team-layout {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.team-block {
  display: flex;
  flex-direction: column;
  gap: 18px;
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
  letter-spacing: -0.288px;
}

.eyebrow {
  color: var(--color-accent-hover);
  font-size: 0.75rem;
  font-weight: 590;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.leader-card,
.member-card {
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid var(--border-standard);
  border-radius: 8px;
  box-shadow: var(--shadow-card);
}

.leader-card {
  display: flex;
  align-items: center;
  min-height: 132px;
  padding: 28px;
}

.leader-card h3 {
  margin: 0 0 8px;
  color: var(--color-text);
  font-size: 1.6rem;
  font-weight: 510;
  letter-spacing: -0.288px;
}

.leader-card p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

.member-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.member-card {
  min-height: 92px;
  padding: 18px;
}

.member-card span {
  display: block;
  margin-bottom: 10px;
  color: var(--color-text-muted);
  font-size: 0.8rem;
}

.member-card strong {
  color: var(--color-text-secondary);
  font-size: 1rem;
  font-weight: 510;
}

@media (max-width: 768px) {
  .page-container {
    padding: 0 0 40px;
  }

  .header-bg-text {
    font-size: 6rem;
  }

  .team-layout {
    gap: 32px;
  }

  .advisor-section {
    margin-bottom: 42px;
  }

  .advisor-section h2 {
    margin-bottom: 24px;
  }

  .advisor-grid {
    gap: 20px;
  }

  .advisor-grid .team-card {
    width: 100%;
  }

  .image-wrapper-advisor {
    height: min(420px, 115vw);
  }

  .card-info {
    padding: 18px;
  }

  .block-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }

  .member-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .leader-card,
  .member-card {
    padding: 20px;
  }
}
</style>
