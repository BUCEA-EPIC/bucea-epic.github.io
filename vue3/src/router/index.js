// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/about', name: 'About', component: AboutView },
  { path: '/team', name: 'Team', component: () => import('../views/TeamView.vue') },
  { path: '/projects', name: 'Projects', component: () => import('../views/ProjectsView.vue') },
  { path: '/awards', name: 'Awards', component: () => import('../views/AwardsView.vue') },
  { path: '/resources', name: 'Resources', component: () => import('../views/ResourcesView.vue') },
  { path: '/news', name: 'News', component: () => import('../views/NewsView.vue') },
  { path: '/contact', name: 'Contact', component: () => import('../views/ContactView.vue') },
  { path: '/event', name: 'Event', component: () => import('../views/EventView.vue') },

  // --- 管理员页面 ---
  { 
    path: '/admin', 
    name: 'Admin', 
    component: () => import('../views/AdminView.vue'),
    // 【关键点】添加这个 meta 标记，告诉 App.vue 隐藏导航栏和页脚
    meta: { hideLayout: true } 
  },

  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
