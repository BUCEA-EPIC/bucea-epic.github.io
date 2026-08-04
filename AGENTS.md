# Repository Guidelines

## 项目概览

Vue 3 + Vite + **Cloudflare Workers Assets** 官网，展示北京建筑大学光启Ray-space工作室内容。

对齐 create-cloudflare Vue (Workers) 约定：

| 角色 | 路径 |
|------|------|
| 前端 SPA | `src/` |
| Worker API | `server/`（`wrangler.jsonc` → `main`） |
| 静态资源 | `public/` |
| 配置 | `wrangler.jsonc`、`vite.config.js` |
| 绑定类型 | `worker-configuration.d.ts`（`npm run cf-typegen`） |

主要路由：`/`、`/event`、`/about`、`/team`、`/projects`、`/resources`、`/news`、`/contact`；隐藏管理入口 `/admin`。

## 目录约定

```text
src/
  components/     # 通用 UI
  views/          # 页面 *View.vue
  composables/    # 组合式逻辑
  data/           # 纯展示数据（team、news…）
  lib/            # 前端基础设施（apiUrl 等）
  styles/         # 全局样式
  router/
server/
  index.ts        # fetch 路由入口
  lib/            # http、auth 等可复用模块
  routes/         # 业务路由（如 wechat-qr）
```

- 前端 **不要** 直接访问 bindings；一律 `fetch('/api/...')`。
- 运营可变资源（微信二维码）走 R2 + API，**不要** 写回 git。
- `wrangler.jsonc` **不要** 手写 `assets.directory`（由 Vite 插件注入）。

## 命令

- `npm run dev` / `build` / `preview` / `deploy`
- `npm run cf-typegen` — 绑定变更后必跑
- `npm run check:worker` — Worker TS 检查
- `npm run build:static:github` / `build:static:server` — 纯静态旁路

## 代码风格

- Vue / JS / CSS / TS：2 空格缩进
- 页面：`PascalCase` + `View.vue`
- 数据模块：`camelCase.js`（如 `teamData.js`）
- 改动聚焦，避免无关大重构

## 验证

```bash
npm run check:worker
npm run build
```

静态部署相关再跑对应 `build:static:*`。

## 提交

Conventional Commits + 简体中文说明（`feat:` / `fix:` / `refactor:` / `docs:`）。

## 安全

- Secrets：`ADMIN_PASSWORD`、`ADMIN_SESSION_SECRET` 仅 Wrangler secrets 或 `.dev.vars`
- 勿提交 `.dev.vars`、密钥、令牌
- `VITE_SITE_BASE` 控制基路径；`VITE_API_BASE` 供静态镜像读主站 API
