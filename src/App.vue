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
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
    
    <Footer />
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

.page-shell-enter-active,
.page-shell-leave-active {
  transition: opacity 0.18s ease;
}

.page-shell-enter-from,
.page-shell-leave-to {
  opacity: 0;
}

.page-shell-enter-to,
.page-shell-leave-from {
  opacity: 1;
}

@media (max-width: 768px) {
  #app .header p {
    max-width: 30rem;
    margin-left: 0;
    margin-right: 0;
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

  .page-shell-enter-active,
  .page-shell-leave-active {
    transition-duration: 0.24s;
  }

}
</style>
