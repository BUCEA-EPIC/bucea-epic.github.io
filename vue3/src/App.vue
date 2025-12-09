<script setup>
import { useRoute } from 'vue-router'
// 请确保路径正确，如果你的组件在其他位置，请调整 import 路径
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

// 获取当前路由对象，用于访问 meta 属性
const route = useRoute()
</script>

<template>
  <div id="app">
    <Navbar v-if="!route.meta.hideLayout" />
    
    <main :class="route.meta.hideLayout ? '' : 'main-content'">
      <router-view />
    </main>
    
    <Footer v-if="!route.meta.hideLayout" />
  </div>
</template>

<style>
/* 全局样式重置 */
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f8f9fa;
  color: #333;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 普通页面的内容区域样式：保持 20px 内边距 */
.main-content {
  flex: 1;
  padding: 20px;
}
</style>