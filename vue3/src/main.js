import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 引入路由配置，而不是引入具体的 View

// 1. 引入 tsParticles
import Particles from '@tsparticles/vue3'
import { loadFull } from "tsparticles"; // 如果你需要加载完整的粒子效果

// 2. 引入 Element Plus 及其样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 3. 引入图标库
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 引入全局样式 (如果你有的话)
// import './assets/main.css' 

const app = createApp(App)

// 使用路由
app.use(router)

// 使用 Element Plus
app.use(ElementPlus)

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册粒子组件
app.component('Particles', Particles)

app.mount('#app')