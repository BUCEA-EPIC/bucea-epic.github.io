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
    ├── lib/                   # 鉴权、HTTP 工具
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

## 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发（Workers runtime + HMR） |
| `npm run build` | 生产构建（Worker + client） |
| `npm run preview` | 构建后预览 |
| `npm run deploy` | 构建并部署到 Cloudflare |
| `npm run cf-typegen` | 根据 wrangler 生成 `worker-configuration.d.ts` |
| `npm run check:worker` | TypeScript 检查 `server/` |
| `npm run build:static:github` | GitHub Pages 纯静态包 |
| `npm run build:static:server` | 自有静态机纯静态包（可含备案） |

## Cloudflare 部署

```bash
npx wrangler r2 bucket create bucea-epic-wechat-qr
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_SESSION_SECRET
npm run deploy
```

绑定与 secrets 变更后请执行：

```bash
npm run cf-typegen
```

## 静态旁路部署

- GitHub Pages：`build:static:github`（`VITE_API_BASE=https://rayspace.org`）
- 自有静态机：`build:static:server`

动态能力（二维码管理）以 Cloudflare 主站 `rayspace.org` 为准。
