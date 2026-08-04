export const CONTENT_TYPES = ['site', 'team', 'projects', 'resources', 'news'] as const

export type ContentType = (typeof CONTENT_TYPES)[number]

export type SiteContent = {
  contactEmail: string
  githubUrl: string
  address: string
  contactIntro: string
  wechatIntro: string
}

export type TeamMember = {
  id: string
  name: string
  role: string
  bio: string
  avatar: string
  avatarWidth?: number
  avatarHeight?: number
}

export type TeamContent = {
  advisors: TeamMember[]
  coreTeam: TeamMember[]
}

export type Project = {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  url: string
}

export type ResourceItem = {
  id: string
  title: string
  subtitle: string
  description: string
  url: string
}

export type ResourceSection = {
  id: string
  category: string
  description: string
  items: ResourceItem[]
}

export type NewsItem = {
  id: string
  title: string
  date: string
  excerpt: string
  image: string
}

export type ContentPayloadMap = {
  site: SiteContent
  team: TeamContent
  projects: Project[]
  resources: ResourceSection[]
  news: NewsItem[]
}

export type ContentSnapshot = {
  content: Partial<ContentPayloadMap>
  meta: Partial<Record<ContentType, ContentMeta>>
}

export type ContentMeta = {
  version: number
  updatedAt: string
  updatedBy: string
}

export class ContentConflictError extends Error {
  constructor() {
    super('内容已被其他管理员更新，请刷新后重试')
    this.name = 'ContentConflictError'
  }
}

export class ContentStorageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContentStorageError'
  }
}

const MAX_CONTENT_BYTES = 512 * 1024
const MAX_ITEMS = 120
const MAX_RESOURCE_SECTIONS = 40

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function text(value: unknown, field: string, maxLength: number, required = false): string {
  if (typeof value !== 'string') {
    if (!required && (value === undefined || value === null)) return ''
    throw new Error(`${field} 必须是文本`)
  }

  const result = value.trim()
  if (required && !result) throw new Error(`${field} 不能为空`)
  if (result.length > maxLength) throw new Error(`${field} 超出长度限制`)
  return result
}

function identifier(value: unknown, fallback: string): string {
  const result = text(value, 'id', 120)
  return result || fallback
}

function safeUrl(value: unknown, field: string, required = false): string {
  const result = text(value, field, 1000, required)
  if (!result) return ''
  if (result.startsWith('/') && !result.startsWith('//')) return result
  if (result.startsWith('#')) throw new Error(`${field} 不允许使用占位链接`)

  let parsed: URL
  try {
    parsed = new URL(result)
  } catch {
    throw new Error(`${field} 必须是 http(s) URL 或站内路径`)
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(`${field} 只允许使用 http(s) URL`)
  }
  return result
}

function stringList(value: unknown, field: string, maxItems: number, maxLength: number): string[] {
  if (!Array.isArray(value)) throw new Error(`${field} 必须是数组`)
  if (value.length > maxItems) throw new Error(`${field} 条目过多`)
  return value.map((item, index) => text(item, `${field}[${index}]`, maxLength, true))
}

function dimension(value: unknown, field: string): number | undefined {
  if (value === undefined || value === null || value === '') return undefined
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 10000) {
    throw new Error(`${field} 必须是 1-10000 的整数`)
  }
  return value
}

function validateMember(value: unknown, index: number, type: string): TeamMember {
  if (!isRecord(value)) throw new Error(`${type}[${index}] 格式无效`)
  const result: TeamMember = {
    id: identifier(value.id, `${type}-${index + 1}`),
    name: text(value.name, `${type}[${index}].name`, 80, true),
    role: text(value.role, `${type}[${index}].role`, 120),
    bio: text(value.bio, `${type}[${index}].bio`, 3000),
    avatar: safeUrl(value.avatar, `${type}[${index}].avatar`)
  }
  const avatarWidth = dimension(value.avatarWidth, `${type}[${index}].avatarWidth`)
  const avatarHeight = dimension(value.avatarHeight, `${type}[${index}].avatarHeight`)
  if (avatarWidth !== undefined) result.avatarWidth = avatarWidth
  if (avatarHeight !== undefined) result.avatarHeight = avatarHeight
  return result
}

function validateTeam(payload: unknown): TeamContent {
  if (!isRecord(payload)) throw new Error('团队配置格式无效')
  const advisors = payload.advisors
  const coreTeam = payload.coreTeam
  if (!Array.isArray(advisors) || !Array.isArray(coreTeam)) {
    throw new Error('团队配置必须包含 advisors 和 coreTeam 数组')
  }
  if (advisors.length > MAX_ITEMS || coreTeam.length > MAX_ITEMS) {
    throw new Error('团队成员数量超出限制')
  }
  return {
    advisors: advisors.map((item, index) => validateMember(item, index, 'advisors')),
    coreTeam: coreTeam.map((item, index) => validateMember(item, index, 'coreTeam'))
  }
}

function validateProject(value: unknown, index: number): Project {
  if (!isRecord(value)) throw new Error(`projects[${index}] 格式无效`)
  return {
    id: identifier(value.id, `project-${index + 1}`),
    title: text(value.title, `projects[${index}].title`, 160, true),
    description: text(value.description, `projects[${index}].description`, 4000, true),
    image: safeUrl(value.image, `projects[${index}].image`),
    tags: stringList(value.tags, `projects[${index}].tags`, 20, 60),
    url: safeUrl(value.url, `projects[${index}].url`)
  }
}

function validateProjects(payload: unknown): Project[] {
  if (!Array.isArray(payload)) throw new Error('项目配置必须是数组')
  if (payload.length > MAX_ITEMS) throw new Error('项目数量超出限制')
  return payload.map(validateProject)
}

function validateResourceItem(value: unknown, sectionIndex: number, itemIndex: number): ResourceItem {
  if (!isRecord(value)) throw new Error(`resources[${sectionIndex}].items[${itemIndex}] 格式无效`)
  const prefix = `resources[${sectionIndex}].items[${itemIndex}]`
  return {
    id: identifier(value.id, `resource-${sectionIndex + 1}-${itemIndex + 1}`),
    title: text(value.title, `${prefix}.title`, 160, true),
    subtitle: text(value.subtitle, `${prefix}.subtitle`, 500),
    description: text(value.description, `${prefix}.description`, 4000, true),
    url: safeUrl(value.url, `${prefix}.url`)
  }
}

function validateResources(payload: unknown): ResourceSection[] {
  if (!Array.isArray(payload)) throw new Error('资源配置必须是数组')
  if (payload.length > MAX_RESOURCE_SECTIONS) throw new Error('资源分类数量超出限制')
  return payload.map((value, index) => {
    if (!isRecord(value)) throw new Error(`resources[${index}] 格式无效`)
    if (!Array.isArray(value.items)) throw new Error(`resources[${index}].items 必须是数组`)
    if (value.items.length > MAX_ITEMS) throw new Error(`resources[${index}].items 条目过多`)
    return {
      id: identifier(value.id, `resource-section-${index + 1}`),
      category: text(value.category, `resources[${index}].category`, 160, true),
      description: text(value.description, `resources[${index}].description`, 2000),
      items: value.items.map((item, itemIndex) =>
        validateResourceItem(item, index, itemIndex)
      )
    }
  })
}

function validateNewsItem(value: unknown, index: number): NewsItem {
  if (!isRecord(value)) throw new Error(`news[${index}] 格式无效`)
  return {
    id: identifier(value.id, `news-${index + 1}`),
    title: text(value.title, `news[${index}].title`, 200, true),
    date: text(value.date, `news[${index}].date`, 80, true),
    excerpt: text(value.excerpt, `news[${index}].excerpt`, 4000, true),
    image: safeUrl(value.image, `news[${index}].image`)
  }
}

function validateNews(payload: unknown): NewsItem[] {
  if (!Array.isArray(payload)) throw new Error('新闻配置必须是数组')
  if (payload.length > MAX_ITEMS) throw new Error('新闻数量超出限制')
  return payload.map(validateNewsItem)
}

function validateSite(payload: unknown): SiteContent {
  if (!isRecord(payload)) throw new Error('站点配置格式无效')
  const contactEmail = text(payload.contactEmail, 'site.contactEmail', 200, true)
  if (!/^\S+@\S+\.\S+$/.test(contactEmail)) throw new Error('site.contactEmail 格式无效')
  return {
    contactEmail,
    githubUrl: safeUrl(payload.githubUrl, 'site.githubUrl'),
    address: text(payload.address, 'site.address', 500, true),
    contactIntro: text(payload.contactIntro, 'site.contactIntro', 1000, true),
    wechatIntro: text(payload.wechatIntro, 'site.wechatIntro', 1000, true)
  }
}

export function validateContentPayload<T extends ContentType>(
  type: T,
  payload: unknown
): ContentPayloadMap[T] {
  switch (type) {
    case 'site':
      return validateSite(payload) as ContentPayloadMap[T]
    case 'team':
      return validateTeam(payload) as ContentPayloadMap[T]
    case 'projects':
      return validateProjects(payload) as ContentPayloadMap[T]
    case 'resources':
      return validateResources(payload) as ContentPayloadMap[T]
    case 'news':
      return validateNews(payload) as ContentPayloadMap[T]
  }
}

export function isContentType(value: string): value is ContentType {
  return (CONTENT_TYPES as readonly string[]).includes(value)
}

export async function readContent(db: D1Database | undefined): Promise<ContentSnapshot> {
  const snapshot: ContentSnapshot = { content: {}, meta: {} }
  const content = snapshot.content as unknown as Record<string, unknown>
  if (!db) return snapshot

  const result = await db
    .prepare(
      'SELECT content_type, version, payload, updated_at, updated_by FROM content_entries'
    )
    .all<{
      content_type: string
      version: number
      payload: string
      updated_at: string
      updated_by: string
    }>()

  for (const row of result.results) {
    if (!isContentType(row.content_type)) continue
    try {
      const payload = JSON.parse(row.payload)
      content[row.content_type] = validateContentPayload(row.content_type, payload)
      snapshot.meta[row.content_type] = {
        version: row.version,
        updatedAt: row.updated_at,
        updatedBy: row.updated_by
      }
    } catch (error) {
      console.error(`Ignoring invalid ${row.content_type} content`, error)
    }
  }

  return snapshot
}

export async function saveContent<T extends ContentType>(
  db: D1Database | undefined,
  type: T,
  payload: unknown,
  expectedVersion: number | null,
  updatedBy = 'admin'
): Promise<{ payload: ContentPayloadMap[T]; meta: ContentMeta }> {
  if (!db) throw new ContentStorageError('内容数据库尚未配置，请先配置 CONTENT_DB')

  const validated = validateContentPayload(type, payload)
  const current = await db
    .prepare('SELECT version FROM content_entries WHERE content_type = ?1')
    .bind(type)
    .first<{ version: number }>()

  const currentVersion = current?.version ?? null
  if (expectedVersion !== currentVersion) {
    throw new ContentConflictError()
  }

  const nextVersion = (currentVersion ?? 0) + 1
  const updatedAt = new Date().toISOString()
  const serialized = JSON.stringify(validated)

  const write = current
    ? db
        .prepare(
          `UPDATE content_entries
           SET version = ?1, payload = ?2, updated_at = ?3, updated_by = ?4
           WHERE content_type = ?5 AND version = ?6`
        )
        .bind(nextVersion, serialized, updatedAt, updatedBy, type, currentVersion)
    : db
        .prepare(
          `INSERT INTO content_entries
           (content_type, version, payload, updated_at, updated_by)
           VALUES (?1, ?2, ?3, ?4, ?5)`
        )
        .bind(type, nextVersion, serialized, updatedAt, updatedBy)

  let results: D1Result<unknown>[]
  try {
    results = await db.batch([
      write,
      db
        .prepare(
          `INSERT OR IGNORE INTO content_revisions
           (content_type, version, payload, updated_at, updated_by)
           VALUES (?1, ?2, ?3, ?4, ?5)`
        )
        .bind(type, nextVersion, serialized, updatedAt, updatedBy)
    ])
  } catch (cause) {
    if (cause instanceof Error && /constraint|unique/i.test(cause.message)) {
      throw new ContentConflictError()
    }
    throw cause
  }

  if ((results[0]?.meta?.changes ?? 0) !== 1) {
    throw new ContentConflictError()
  }

  return {
    payload: validated,
    meta: { version: nextVersion, updatedAt, updatedBy }
  }
}

export function contentBytes(payload: unknown): number {
  return new TextEncoder().encode(JSON.stringify(payload)).byteLength
}

export { MAX_CONTENT_BYTES }
