import { advisors, coreTeam } from './teamData.js'
import { projects } from './projectsData.js'
import { resources } from './resourcesData.js'
import { newsData } from './newsData.js'
import { CONTACT_EMAIL, GITHUB_URL } from './siteInfo.js'

const withId = (items, prefix) =>
  items.map((item, index) => ({
    id: item.id || `${prefix}-${index + 1}`,
    ...item
  }))

const defaultTeam = {
  advisors: withId(advisors, 'advisor'),
  coreTeam: withId(coreTeam, 'member')
}

const defaultProjects = withId(projects, 'project')

const defaultResources = resources.map((section, sectionIndex) => ({
  id: section.id || `resource-section-${sectionIndex + 1}`,
  ...section,
  items: withId(section.items, `resource-${sectionIndex + 1}`)
}))

const defaultNews = withId(newsData, 'news')

export const defaultContent = {
  site: {
    contactEmail: CONTACT_EMAIL,
    githubUrl: GITHUB_URL,
    address: '北京建筑大学大兴校区\n工程实践创新中心 322 室',
    contactIntro: '技术交流、项目协作或加入团队，都可以通过下面的方式找到我们。',
    wechatIntro: '使用微信扫码加入招新群，获取活动通知并与成员交流。'
  },
  team: defaultTeam,
  projects: defaultProjects,
  resources: defaultResources,
  news: defaultNews
}

export function cloneContent(content = defaultContent) {
  return JSON.parse(JSON.stringify(content))
}

function stripDefaultImage(item, fallback) {
  const result = { ...item }
  if (result.avatar && result.avatar === fallback?.avatar) delete result.avatar
  if (result.image && result.image === fallback?.image) delete result.image
  return result
}

export function prepareStoredContent(content) {
  const value = cloneContent(content)
  const fallback = defaultContent

  value.team.advisors = value.team.advisors.map((item, index) =>
    stripDefaultImage(item, fallback.team.advisors[index])
  )
  value.team.coreTeam = value.team.coreTeam.map((item, index) =>
    stripDefaultImage(item, fallback.team.coreTeam[index])
  )
  value.projects = value.projects.map((item, index) =>
    stripDefaultImage(item, fallback.projects[index])
  )
  value.news = value.news.map((item, index) => stripDefaultImage(item, fallback.news[index]))
  return value
}

function mergeList(defaults, stored) {
  if (!Array.isArray(stored)) return cloneContent(defaults)
  return stored.map((item, index) => ({
    ...(defaults[index] || {}),
    ...(item || {})
  }))
}

function mergeTeam(defaults, stored) {
  return {
    advisors: mergeList(defaults.advisors, stored?.advisors),
    coreTeam: mergeList(defaults.coreTeam, stored?.coreTeam)
  }
}

function mergeResources(defaults, stored) {
  return mergeList(defaults, stored).map((section, index) => ({
    ...section,
    items: mergeList(defaults[index]?.items || [], stored?.[index]?.items)
  }))
}

export function mergeContent(stored) {
  const fallback = cloneContent()
  if (!stored || typeof stored !== 'object') return fallback

  return {
    site: {
      ...fallback.site,
      ...(stored.site || {})
    },
    team: mergeTeam(fallback.team, stored.team),
    projects: mergeList(fallback.projects, stored.projects),
    resources: mergeResources(fallback.resources, stored.resources),
    news: mergeList(fallback.news, stored.news)
  }
}
