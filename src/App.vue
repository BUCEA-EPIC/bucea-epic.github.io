<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div id="app">
    <a href="#main-content" class="skip-link">跳到主内容</a>
    <Navbar />

    <main id="main-content" class="main-content" tabindex="-1">
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
  .page-shell-enter-active,
  .page-shell-leave-active {
    transition-duration: 0.24s;
  }
}
</style>
