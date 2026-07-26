// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const SITE_TITLE = '317工作室 | 北京建筑大学工程实践创新中心'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/about', name: 'About', component: () => import('../views/AboutView.vue'), meta: { title: '关于我们' } },
  { path: '/team', name: 'Team', component: () => import('../views/TeamView.vue'), meta: { title: '团队成员' } },
  { path: '/projects', name: 'Projects', component: () => import('../views/ProjectsView.vue'), meta: { title: '项目与机器人' } },
  { path: '/resources', name: 'Resources', component: () => import('../views/ResourcesView.vue'), meta: { title: '教程与资源' } },
  { path: '/news', name: 'News', component: () => import('../views/NewsView.vue'), meta: { title: '新闻与动态' } },
  { path: '/contact', name: 'Contact', component: () => import('../views/ContactView.vue'), meta: { title: '联系我们' } },
  { path: '/event', name: 'Event', component: () => import('../views/EventView.vue'), meta: { title: '萌新种子杯' } },
  { path: '/event/history', name: 'EventHistory', component: () => import('../views/EventHistoryView.vue'), meta: { title: '往年赛事' } },
  { path: '/event/awards', redirect: '/event/5/awards' },
  { path: '/event/5/awards', name: 'EventAwards5', component: () => import('../views/EventAwardsView.vue'), meta: { title: '第五届获奖公示' } },
  { path: '/event/:editionId(\\d+)', name: 'EventEdition', component: () => import('../views/EventView.vue'), meta: { title: '萌新种子杯' } },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFoundView.vue'), meta: { title: '页面未找到' } }
]

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      const target = {
        el: to.hash,
        top: 96,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      }

      if (to.path === from.path) {
        return target
      }

      return new Promise((resolve) => {
        window.setTimeout(() => resolve(target), 450)
      })
    }

    return { top: 0 }
  }
})

router.afterEach((to, from) => {
  document.title = to.meta.title ? `${to.meta.title} | 317工作室` : SITE_TITLE

  // canonical 随路由更新，双部署（GitHub Pages / 自有域名）下各自指向本域地址
  let canonical = document.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', `${window.location.origin}${to.fullPath}`)

  // 路由切换后把焦点复位到主内容区，让键盘/读屏用户获知已进入新页面。
  // 跳过站点首次加载（from.name 为空）与锚点跳转（交给 scrollBehavior 的锚点目标）。
  if (from.name && !to.hash) {
    requestAnimationFrame(() => {
      document.getElementById('main-content')?.focus({ preventScroll: true })
    })
  }
})

export default router
