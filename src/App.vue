<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div id="app">
    <Navbar />
    
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition name="page-shell" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
    </main>
    
    <Footer />
  </div>
</template>

<style>
/* 全局样式重置 */
html {
  overflow-x: hidden;
  -webkit-text-size-adjust: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Inter Variable", Inter, "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: #08090a;
  color: #f7f8f8;
  line-height: 1.5;
  overflow-x: hidden;
  font-feature-settings: "cv01", "ss03";
}

img,
video,
canvas {
  max-width: 100%;
}

button,
input,
select,
textarea {
  font: inherit;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #08090a;
}

.main-content {
  flex: 1;
  padding: 0 20px 72px;
}

.page-shell-enter-active,
.page-shell-leave-active {
  transition: opacity 0.42s ease, transform 0.42s ease, filter 0.42s ease;
}

.page-shell-enter-from,
.page-shell-leave-to {
  opacity: 0;
  transform: translateY(18px);
  filter: blur(14px);
}

.page-shell-enter-to,
.page-shell-leave-from {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

@media (max-width: 768px) {
  .main-content {
    padding: 12px;
  }

  #app .page-container {
    width: 100%;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 32px;
  }

  #app .header {
    padding: 42px 8px 32px;
    margin-bottom: 32px;
  }

  #app .header-bg-text {
    max-width: 100%;
    overflow: hidden;
    font-size: clamp(3.5rem, 18vw, 5.2rem);
  }

  #app .header h1 {
    font-size: 2.15rem;
    line-height: 1.15;
    margin-bottom: 14px;
  }

  #app .header h1::after {
    margin-top: 14px;
  }

  #app .header p {
    max-width: 30rem;
    margin-left: auto;
    margin-right: auto;
    font-size: 1rem;
    line-height: 1.55;
  }

  #app .section {
    padding: 48px 0;
  }

  #app .content-section {
    margin-bottom: 44px;
  }

  #app .text-content h2,
  #app .team-section h2,
  #app .award-section h2,
  #app .resource-section h2 {
    font-size: 1.55rem;
    line-height: 1.25;
  }

  #app .awards-grid,
  #app .news-grid,
  #app .resource-grid,
  #app .team-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 420px) {
  .main-content {
    padding: 10px;
  }

  #app .header h1 {
    font-size: 1.9rem;
  }

  #app .header-bg-text {
    font-size: 3.35rem;
  }
}
</style>
