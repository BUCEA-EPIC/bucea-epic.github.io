<template>
  <nav class="navbar">
    <div class="container">

      <!-- LOGO：PC 正常显示；手机端自动换行成两行 -->
      <router-link to="/" class="logo">
        工程实践创新中心<span class="mobile-break"><br/></span>314工作室
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
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  position: relative;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #343a40;
  text-decoration: none;
  line-height: 1.2;
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
}
.nav-links-desktop a {
  color: #555;
  margin: 0 12px;
  text-decoration: none;
  font-size: 0.95rem;
  padding-bottom: 5px;
  border-bottom: 2px solid transparent;
  transition: color 0.3s, border-bottom-color 0.3s;
  white-space: nowrap;
}
.nav-links-desktop a:hover,
.nav-links-desktop a.router-link-exact-active {
  color: #007bff;
  border-bottom-color: #007bff;
}

/* 手机端导航 */
.more-btn {
  display: none;
  flex: 0 0 auto;
  padding: 9px 13px;
  font-size: 0.94rem;
  line-height: 1;
}

/* 手机端下拉菜单 */
.nav-links-mobile {
  position: absolute;
  top: calc(100% + 10px);
  right: 20px;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-radius: 8px;
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
  color: #555;
  text-decoration: none;
  font-size: 0.95rem;
  border-radius: 6px;
}

.nav-links-mobile a.router-link-exact-active {
  color: #007bff;
  background: #eef6ff;
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
    padding: 0.7rem 0;
  }

  .container {
    padding: 0 12px;
    gap: 12px;
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
    background: #007bff;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
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
