// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const SITE_TITLE = '317工作室 | 北京建筑大学工程实践创新中心'

// 站点默认描述，与 index.html 静态 description 保持一致，作为无独立描述路由的回退
const SITE_DESCRIPTION = '探索机器人奥秘，学习机械设计、电路焊接与编程控制，实现创意与实践结合的梦想。'

const routes = [
  { path: '/', name: 'Home', component: HomeView, meta: { description: SITE_DESCRIPTION } },
  { path: '/about', name: 'About', component: () => import('../views/AboutView.vue'), meta: { title: '关于我们', description: '北京建筑大学工程实践创新中心317工作室，围绕真实工程问题整合机械结构、电控系统、嵌入式与感知算法，带成员从基础学习走向系统协同。' } },
  { path: '/team', name: 'Team', component: () => import('../views/TeamView.vue'), meta: { title: '团队成员', description: '认识317工作室的指导教师与学生团队，来自不同专业背景，在长期协作中共同完成机器人与工程实践项目。' } },
  { path: '/projects', name: 'Projects', component: () => import('../views/ProjectsView.vue'), meta: { title: '项目与机器人', description: '浏览317工作室的机器人与工程实践作品，涵盖机械设计、电路控制与嵌入式编程的完整项目案例。' } },
  { path: '/resources', name: 'Resources', component: () => import('../views/ResourcesView.vue'), meta: { title: '教程与资源', description: '317工作室整理的学习资源合集，涵盖机械、电路、编程与工具使用，助你从入门到进阶。' } },
  { path: '/news', name: 'News', component: () => import('../views/NewsView.vue'), meta: { title: '新闻与动态', description: '317工作室的最新动态、赛事战报与成长记录，见证每一次突破与实践成果。' } },
  { path: '/contact', name: 'Contact', component: () => import('../views/ContactView.vue'), meta: { title: '联系我们', description: '与317工作室取得联系，无论是技术探讨、加入意向还是合作交流，我们都期待与你对话。' } },
  { path: '/event', name: 'Event', component: () => import('../views/EventView.vue'), meta: { title: '萌新种子杯', description: '“萌新种子杯”是317工作室面向新成员的工程实践赛事，涵盖视觉循迹、电源设计与三维建模等赛道。' } },
  { path: '/event/history', name: 'EventHistory', component: () => import('../views/EventHistoryView.vue'), meta: { title: '往年赛事', description: '查看历届“萌新种子杯”的赛事信息、赛道内容与获奖公示结果。' } },
  { path: '/event/awards', redirect: '/event/5/awards' },
  { path: '/event/5/awards', name: 'EventAwards5', component: () => import('../views/EventAwardsView.vue'), meta: { title: '第五届获奖公示', description: '第五届“萌新种子杯”最终获奖名单，按赛道与奖项等级公示各获奖队伍与成员。' } },
  { path: '/event/:editionId(\\d+)', name: 'EventEdition', component: () => import('../views/EventView.vue'), meta: { title: '萌新种子杯', description: '“萌新种子杯”是317工作室面向新成员的工程实践赛事，涵盖视觉循迹、电源设计与三维建模等赛道。' } },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFoundView.vue'), meta: { title: '页面未找到', description: SITE_DESCRIPTION } }
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

// 按 name 属性获取（或创建）<meta> 标签，复用现有原生 DOM 写法，避免新增依赖
const upsertMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

router.afterEach((to, from) => {
  document.title = to.meta.title ? `${to.meta.title} | 317工作室` : SITE_TITLE

  // 描述随路由更新：无独立描述的路由回退到站点默认描述，避免残留上一页文案
  const description = to.meta.description || SITE_DESCRIPTION
  upsertMeta('name', 'description', description)
  upsertMeta('property', 'og:description', description)

  // canonical 随路由更新，双部署（GitHub Pages / 自有域名）下各自指向本域地址
  let canonical = document.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', `${window.location.origin}${to.fullPath}`)

  // og:url 与 canonical 对齐（对执行 JS 的消费者与以渲染后 DOM 为准的工具生效）
  upsertMeta('property', 'og:url', `${window.location.origin}${to.fullPath}`)

  // 路由切换后把焦点复位到主内容区，让键盘/读屏用户获知已进入新页面。
  // 跳过站点首次加载（from.name 为空）与锚点跳转（交给 scrollBehavior 的锚点目标）。
  if (from.name && !to.hash) {
    requestAnimationFrame(() => {
      document.getElementById('main-content')?.focus({ preventScroll: true })
    })
  }
})

export default router
