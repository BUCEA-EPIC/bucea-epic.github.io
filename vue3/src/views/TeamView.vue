<script setup>
import { onMounted } from 'vue'
import { advisors, coreTeam } from '../data/teamData.js'

// 滚动入场动画
onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible')
      })
    },
    { threshold: 0.1 }
  )

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))
})
</script>

<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="header">
      <span class="header-bg-text">TEAM</span>
      <h1>我们的团队</h1>
      <p>一群热爱创造的梦想家和实践者</p>
    </div>

    <!-- 指导老师 -->
    <section class="team-section animate-on-scroll">
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

    <!-- 核心团队 -->
    <section class="team-section animate-on-scroll">
      <h2>核心团队</h2>
      <div class="team-grid">
        <div class="team-card" v-for="member in coreTeam" :key="member.name">
          <div class="image-wrapper-member">
            <img :src="member.avatar" :alt="member.name">
          </div>
          <div class="card-info">
            <h3>{{ member.name }}</h3>
            <p class="role">{{ member.role }}</p>
            <p class="bio">{{ member.bio }}</p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header {
  text-align: center;
  padding: 60px 20px;
  margin-bottom: 40px;
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
  animation: fadeInUp 0.8s ease-out forwards;
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
  animation-delay: 0.2s;
}

.page-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px 40px;
}

.team-section {
  margin-bottom: 60px;
}

.team-section h2 {
  font-size: 2rem;
  font-weight: 300;
  text-align: center;
  margin-bottom: 40px;
}

.animate-on-scroll {
  opacity: 0;
  transform: translateY(50px);
  filter: blur(5px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out, filter 0.8s ease-out;
}

.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
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

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.team-card {
  background: #fff;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.team-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

/* ============================== */
/* ⭐ 图片放大效果（悬停） */
/* ============================== */
.team-card img {
  transition: transform 0.3s ease; /* 保证平滑过渡 */
}

.team-card:hover img {
  transform: scale(1.05); /* 放大 5% */
}

/* ============================== */
/* ⭐ 指导老师：更大图片尺寸 */
/* ============================== */
.image-wrapper-advisor {
  width: 100%;
  height: 500px;
  overflow: hidden;
}

.image-wrapper-advisor img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ============================== */
/* ⭐ 核心团队：普通尺寸 */
/* ============================== */
.image-wrapper-member {
  width: 100%;
  height: 280px;
  overflow: hidden;
}

.image-wrapper-member img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-info {
  padding: 20px;
}

.card-info h3 {
  margin: 0 0 5px;
  font-size: 1.3rem;
}

.card-info .role {
  color: #007bff;
  margin: 0 0 10px;
  font-size: 0.9rem;
  font-weight: bold;
}

.card-info .bio {
  font-size: 0.9rem;
  color: #6c757d;
  white-space: pre-wrap;
  word-break: break-word;
}

@media (max-width: 768px) {
  .header-bg-text {
    font-size: 6rem;
  }
}
</style>
