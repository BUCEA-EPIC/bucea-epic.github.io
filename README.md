# 光启Ray-space工作室官网

北京建筑大学光启Ray-space工作室官网。

技术栈与目录对齐 Cloudflare 官方 **Vue + Workers Assets** 模板  
（[文档](https://developers.cloudflare.com/workers/framework-guides/web-apps/vue/) / create-cloudflare）。

```text
.
├── index.html                 # SPA HTML 入口
├── package.json
├── vite.config.js             # Vite + @cloudflare/vite-plugin
├── wrangler.jsonc             # Workers + Assets 配置
├── worker-configuration.d.ts  # wrangler types 生成（绑定类型）
├── tsconfig.json              # 工程 references
├── tsconfig.worker.json       # 仅校验 server/**
├── .dev.vars.example          # 本地 Worker secrets 示例
├── public/                    # 原样发布静态文件
├── migrations/                # D1 数据库迁移
├── src/                       # Vue 前端（client）
│   ├── main.js
│   ├── App.vue
│   ├── assets/
│   ├── components/
│   ├── composables/
│   ├── data/                  # 站点展示用静态数据
│   ├── lib/                   # 前端工具（如 API base）
│   ├── router/
│   ├── styles/
│   └── views/
└── server/                    # Cloudflare Worker（API）
    ├── index.ts               # Worker 入口（wrangler main）
    ├── lib/                   # 鉴权、HTTP、内容仓储与校验
    └── routes/                # 按资源划分的路由处理
```

## 开发

```bash
npm install
cp .dev.vars.example .dev.vars
npm run dev
```

- 本地：`http://127.0.0.1:5173`
- 管理页（隐藏）：`/admin`
- 开发时 `server/` 在 workerd 中运行，R2 等绑定本地模拟
- `/admin` 登录后可管理站点信息、团队成员、项目、教程资源、新闻和微信二维码

## 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发（Workers runtime + HMR） |
| `npm run build` | 生产构建（Worker + client） |
| `npm run preview` | 构建后预览 |
| `npm run deploy` | 构建并部署到 Cloudflare |
| `npm run cf-typegen` | 根据 wrangler 生成 `worker-configuration.d.ts` |
| `npm run check:worker` | TypeScript 检查 `server/` |
| `npm run d1:migrations:list` | 查看 D1 未应用的迁移 |
| `npm run d1:migrations:apply` | 应用 D1 迁移 |
| `npm run build:static:github` | GitHub Pages 纯静态包 |
| `npm run build:static:server` | 自有静态机纯静态包（可含备案） |

## Cloudflare 部署

```bash
npx wrangler r2 bucket create bucea-epic-wechat-qr
npx wrangler d1 create bucea-epic-content
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_SESSION_SECRET
```

创建 D1 后，将命令输出的 `database_id` 写入 `wrangler.jsonc` 对应的
`CONTENT_DB` 配置，然后执行：

```bash
npm run d1:migrations:apply -- --remote
npm run cf-typegen
npm run deploy
```

本地开发首次使用内容后台时，先应用本地迁移：

```bash
npx wrangler d1 migrations apply bucea-epic-content --local
```

绑定与 secrets 变更后请执行：

```bash
npm run cf-typegen
```

## 静态旁路部署

- GitHub Pages：`build:static:github`（`VITE_API_BASE=https://rayspace.org`）
- 自有静态机：`build:static:server`

动态能力（二维码管理）以 Cloudflare 主站 `rayspace.org` 为准。

## 内容管理设计

- D1 `content_entries` 保存 `site`、`team`、`projects`、`resources`、`news` 五类结构化内容。
- D1 `content_revisions` 保存每次发布的完整修订记录，便于审计和后续回滚能力扩展。
- 每个栏目独立版本号，管理员提交时携带 `expectedVersion`，并发编辑会返回 `409`，避免覆盖他人修改。
- Worker 对文本长度、数组数量、URL 协议、邮箱和图片地址进行服务端校验；前台只渲染纯文本，不接受 HTML 注入。
- 前台启动时读取 `/api/content`，D1 未配置、接口异常或某栏目未发布时自动回退到 `src/data/*` 的内置默认内容。
- 微信二维码等二进制媒体继续使用 R2，不写回 Git；团队、项目和新闻图片可使用站内构建资源或公开 HTTPS 地址。

内容接口：

- `GET /api/content`：公开读取已发布内容，支持静态镜像跨域读取。
- `GET /api/admin/content`：管理员读取内容与版本元数据。
- `PUT /api/admin/content/:type`：管理员保存单个栏目，body 为 `{ content, expectedVersion }`。
