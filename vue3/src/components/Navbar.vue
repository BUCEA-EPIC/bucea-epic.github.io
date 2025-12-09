<template>
  <nav class="navbar">
    <div class="container">

      <!-- LOGO：PC 正常显示；手机端自动换行成两行 -->
      <router-link to="/" class="logo">
        工程实践创新中心<span class="mobile-break"><br/></span>314工作室
      </router-link>

      <!-- 手机端 更多按钮 -->
      <button class="more-btn" @click="toggleMenu">
        更多 ▾
      </button>

      <!-- 导航链接 + 下拉动画 -->
      <transition name="dropdown">
        <div v-if="menuOpen" class="nav-links-mobile">
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
  position: relative;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #343a40;
  text-decoration: none;
}

/* PC 显示时不换行 */
.mobile-break {
  display: none;
}

/* PC 端导航 */
.nav-links-desktop {
  display: flex;
  align-items: center;
}
.nav-links-desktop a {
  color: #555;
  margin: 0 12px;
  text-decoration: none;
  font-size: 0.95rem;
  padding-bottom: 5px;
  border-bottom: 2px solid transparent;
  transition: color 0.3s, border-bottom-color 0.3s;
}
.nav-links-desktop a:hover,
.nav-links-desktop a.router-link-exact-active {
  color: #007bff;
  border-bottom-color: #007bff;
}

/* 手机端导航 */
.more-btn {
  display: none;
}

/* 手机端下拉菜单 */
.nav-links-mobile {
  position: absolute;
  top: 70px;
  right: 20px;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-radius: 10px;
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  width: 180px;
  z-index: 2000;
}

.nav-links-mobile a {
  margin: 8px 0;
  color: #555;
  text-decoration: none;
  font-size: 0.95rem;
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
@media (max-width: 768px) {

  /* 手机端 LOGO 换行 */
  .mobile-break {
    display: inline;
  }

  /* 更紧密的两行间距 */
  .logo {
    line-height: 1.1;
    font-size: 1.25rem;
  }

  .nav-links-desktop {
    display: none;
  }

  .more-btn {
    display: block;
    background: #007bff;
    color: white;
    border: none;
    padding: 7px 14px;
    border-radius: 6px;
    font-size: 0.95rem;
    cursor: pointer;
  }
}
</style>
