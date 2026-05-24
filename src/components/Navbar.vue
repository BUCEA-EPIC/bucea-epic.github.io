<template>
  <nav class="navbar">
    <div class="container">

      <!-- LOGO：PC 正常显示；手机端自动换行成两行 -->
      <router-link to="/" class="logo">
        工程实践创新中心<span class="mobile-break"><br/></span>317工作室
      </router-link>

      <!-- 手机端 更多按钮 -->
      <button
        class="more-btn"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="mobile-navigation"
        aria-label="打开导航菜单"
        @click="toggleMenu"
      >
        更多 ▾
      </button>

      <!-- 导航链接 + 下拉动画 -->
      <transition name="dropdown">
        <div v-if="menuOpen" id="mobile-navigation" class="nav-links-mobile">
          <router-link to="/" @click="closeMenu">首页</router-link>
          <router-link to="/event" @click="closeMenu">萌新种子杯</router-link>
          <router-link to="/about" @click="closeMenu">关于我们</router-link>
          <router-link to="/team" @click="closeMenu">团队成员</router-link>
          <router-link to="/projects" @click="closeMenu">项目与机器人</router-link>
          <router-link to="/awards" @click="closeMenu">赛事与荣誉</router-link>
          <router-link to="/resources" @click="closeMenu">教程与资源</router-link>
          <router-link to="/news" @click="closeMenu">新闻与动态</router-link>
          <router-link to="/contact" @click="closeMenu">联系我们</router-link>
        </div>
      </transition>

      <!-- PC 端导航 -->
      <div class="nav-links-desktop">
        <router-link to="/">首页</router-link>
        <router-link to="/event">萌新种子杯</router-link>
        <router-link to="/about">关于我们</router-link>
        <router-link to="/team">团队成员</router-link>
        <router-link to="/projects">项目与机器人</router-link>
        <router-link to="/awards">赛事与荣誉</router-link>
        <router-link to="/resources">教程与资源</router-link>
        <router-link to="/news">新闻与动态</router-link>
        <router-link to="/contact">联系我们</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";

const menuOpen = ref(false);
const toggleMenu = () => (menuOpen.value = !menuOpen.value);
const closeMenu = () => (menuOpen.value = false);
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  padding: 0;
  background: rgba(8, 9, 10, 0.86);
  border-bottom: 1px solid var(--border-subtle);
  backdrop-filter: blur(18px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  min-height: 76px;
  position: relative;
}

.logo {
  color: var(--color-text);
  font-size: 1.22rem;
  font-weight: 510;
  letter-spacing: -0.182px;
  line-height: 1.15;
  text-decoration: none;
  flex: 0 0 auto;
  white-space: nowrap;
}

/* PC 显示时不换行 */
.mobile-break {
  display: none;
}

/* PC 端导航 */
.nav-links-desktop {
  display: flex;
  align-items: center;
  flex: 0 1 auto;
  flex-wrap: nowrap;
  justify-content: flex-end;
  min-width: 0;
  gap: 4px;
}

.nav-links-desktop a {
  margin: 0;
  padding: 8px 9px;
  border: 1px solid transparent;
  border-radius: var(--radius-control);
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  font-weight: 510;
  text-decoration: none;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  white-space: nowrap;
}

.nav-links-desktop a:hover,
.nav-links-desktop a.router-link-exact-active {
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--border-standard);
  color: var(--color-text);
}

/* 手机端导航 */
.more-btn {
  display: none;
  flex: 0 0 auto;
  padding: 9px 13px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  color: var(--color-text);
  font-size: 0.94rem;
  font-weight: 510;
  line-height: 1;
  cursor: pointer;
}

/* 手机端下拉菜单 */
.nav-links-mobile {
  position: absolute;
  top: calc(100% + 10px);
  right: 20px;
  background: rgba(15, 16, 17, 0.98);
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(18px);
  padding: 10px;
  display: flex;
  flex-direction: column;
  width: 200px;
  max-height: calc(100vh - 90px);
  overflow-y: auto;
  z-index: 2000;
}

.nav-links-mobile a {
  min-height: 42px;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: var(--radius-control);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 510;
}

.nav-links-mobile a:hover,
.nav-links-mobile a.router-link-exact-active {
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--border-standard);
  color: var(--color-text);
}

/* ---------- 动画定义 ---------- */
.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}
.dropdown-enter-active {
  transition: all 0.25s ease-out;
}
.dropdown-enter-to {
  opacity: 1;
  transform: translateY(0);
  max-height: 500px;
}

.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 500px;
}
.dropdown-leave-active {
  transition: all 0.25s ease-in;
}
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}

/* ------------- 手机端响应式 ------------- */
@media (max-width: 1180px) {
  .nav-links-desktop {
    display: none;
  }

  .more-btn {
    display: block;
    flex: 0 0 auto;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 0;
  }

  .container {
    padding: 0 12px;
    gap: 12px;
    min-height: 68px;
  }

  /* 手机端 LOGO 换行 */
  .mobile-break {
    display: inline;
  }

  /* 更紧密的两行间距 */
  .logo {
    line-height: 1.1;
    font-size: 1.12rem;
    overflow-wrap: anywhere;
    white-space: normal;
  }

  .more-btn {
    flex: 0 0 auto;
    padding: 8px 12px;
    font-size: 0.9rem;
  }

  .nav-links-mobile {
    left: 12px;
    right: 12px;
    width: auto;
  }
}

@media (max-width: 360px) {
  .logo {
    font-size: 1rem;
  }

  .more-btn {
    padding: 8px 10px;
  }
}
</style>
