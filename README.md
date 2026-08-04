# 光启 Ray-space 工作室官网

北京建筑大学光启 Ray-space 工作室官网。

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
├── public/                    # 原样发布静态文件（含安全头与主域跳转规则）
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
| `npm audit --audit-level=high` | 依赖安全审计 |
| `npm run d1:migrations:list` | 查看 D1 未应用的迁移 |
| `npm run d1:migrations:apply` | 应用 D1 迁移 |
| `npm run build:static:github` | GitHub Pages 纯静态包 |
| `npm run build:static:server` | 自有静态机纯静态包（可含备案） |

## Cloudflare 部署

### 首次初始化资源

```bash
npx wrangler r2 bucket create bucea-epic-wechat-qr
npx wrangler d1 create bucea-epic-content
```

创建 D1 后，将命令输出的 `database_id` 写入 `wrangler.jsonc` 对应的
`CONTENT_DB` 配置。`database_id` 不是密钥，可以提交到 Git；R2 bucket 需要在目标
Cloudflare Account 中存在。

本地手动部署时，再配置 Worker secrets：

```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_SESSION_SECRET
```

然后执行：

```bash
npm run d1:migrations:apply -- --remote
npm run cf-typegen
npm run deploy
```

### GitHub Actions 自动部署

`.github/workflows/deploy-cloudflare.yml` 会在 `main` 推送或手动触发时执行：

1. 安装依赖、检查 Worker 类型并构建前端。
2. 应用远程 D1 migrations。
3. 同步管理员 secrets 到 Worker。
4. 部署 Worker 与 Assets。

`.github/workflows/ci.yml` 会在 PR 和 `main` 变更上执行依赖审计、Worker 类型检查、
Cloudflare 构建和两种静态构建；`main` 应配置为仅允许通过 CI 和 PR 审核合并。Dependabot
会定期提出 npm 与 GitHub Actions 依赖更新。

忘记共享口令时，使用 `.github/workflows/reset-admin-password.yml` 的部署侧恢复工作流。
该工作流只能手动触发，并且要求输入 `RESET` 确认；它不会在公网提供恢复接口。

工作流统一使用 `production` Environment。请在 GitHub 仓库的
`Settings → Environments → production → Environment secrets` 中配置密钥，在
`Environment variables` 中配置非敏感变量；不要在仓库级 Secrets 中重复配置同名值。
生产环境建议为该 Environment 设置必需审批人，并定期轮换 Cloudflare 凭据。

需要配置的名称如下：

| 名称 | 类型 | 用途 |
|------|------|------|
| `CLOUDFLARE_ACCOUNT_ID` | Environment variable | 目标 Cloudflare Account ID；Wrangler 非交互部署必需 |
| `CLOUDFLARE_API_KEY` | Environment secret | Cloudflare Global API Key；与 `CLOUDFLARE_EMAIL` 配套使用 |
| `CLOUDFLARE_EMAIL` | Environment secret | Global API Key 对应的 Cloudflare 登录邮箱 |
| `CLOUDFLARE_API_TOKEN` | Environment secret，可选 | 更推荐的细粒度 API Token；配置后优先于 Global API Key |
| `ADMIN_PASSWORD` | Environment secret | 首次初始化及部署侧应急恢复的基准口令；D1 初始化后不作为日常登录口令 |
| `ADMIN_SESSION_SECRET` | Environment secret | 管理员会话签名密钥 |

你当前计划提供 Global API Key，因此最少需要填写：
`CLOUDFLARE_ACCOUNT_ID`、`CLOUDFLARE_API_KEY`、`CLOUDFLARE_EMAIL`、
`ADMIN_PASSWORD`、`ADMIN_SESSION_SECRET`。不要把这些值提交到 Git、发到聊天或写入 `.env` 文件。

`ADMIN_PASSWORD` 首次用于初始化 D1 中的口令哈希；初始化后，日常口令应在 `/admin` 的
“管理员安全”中修改。若忘记日常口令，请先在 `production` Environment 中替换
`ADMIN_PASSWORD`，再从 GitHub Actions 运行 **Recover Cloudflare admin password**，输入
`RESET` 确认。工作流会更新 D1 哈希、递增口令版本使所有旧会话失效，并记录 GitHub 操作者、
运行编号和提交号；不会记录明文口令。

管理员口令恢复步骤：

1. 打开 `Settings → Environments → production → Environment secrets`，用新的 12–128 位口令替换 `ADMIN_PASSWORD`。
2. 打开 `Actions → Recover Cloudflare admin password → Run workflow`，输入 `RESET` 并运行。
3. 如 `production` Environment 配置了审批规则，等待授权维护者审批；完成后使用新口令登录 `/admin`。

`ADMIN_PASSWORD` 的 Secret 值无法从 GitHub 读取；忘记时应直接替换为新值并保存到团队密码管理器。

管理员口令不存在邮箱找回接口；恢复权限由 GitHub 仓库协作者、`production` Environment
密钥权限和恢复工作流共同控制。建议为 `production` Environment 配置必需审批人，并将
口令保存在团队密码管理器中。

生成会话密钥：

```bash
openssl rand -base64 48
```

Global API Key 权限很大。长期运行建议改用 Cloudflare API Token，并只授予目标
Account 所需的 Workers、D1、R2 权限；工作流已兼容 `CLOUDFLARE_API_TOKEN`，不需要再
改代码。

依赖锁文件通过 npm `overrides` 将 Cloudflare 本地工具链间接使用的 `undici` 锁定到
已修复的 7.x 补丁版本；这是开发/部署工具的供应链约束，不会进入 Worker 运行时依赖。

本地开发首次使用内容后台时，先应用本地迁移：

```bash
npx wrangler d1 migrations apply bucea-epic-content --local
```

绑定与 secrets 变更后请执行：

```bash
npm run cf-typegen
```

## 静态旁路部署

- GitHub Pages：`build:static:github`（`VITE_API_BASE=https://www.rayspace.org`）
- 自有静态机：`build:static:server`

动态能力（内容 API、管理员后台与二维码管理）以 Cloudflare 主站
[`www.rayspace.org`](https://www.rayspace.org/) 为准；GitHub Pages 仅作为静态镜像。
`rayspace.org` 作为 apex 别名永久跳转到 `www.rayspace.org`，避免产生重复入口。

## 内容管理设计

- D1 `content_entries` 保存 `site`、`team`、`projects`、`resources`、`news` 五类结构化内容。
- D1 `content_revisions` 保存每次发布的完整修订记录，便于审计和后续回滚能力扩展。
- 每个栏目独立版本号，管理员提交时携带 `expectedVersion`，并发编辑会返回 `409`，避免覆盖他人修改。
- Worker 对文本长度、数组数量、URL 协议、邮箱和图片地址进行服务端校验；前台只渲染纯文本，不接受 HTML 注入。
- 内容中的 `#` 占位链接会被服务端拒绝；未准备好公开地址的项目或资源应留空，并在前台显示相应的待整理状态。
- 前台启动时读取 `/api/content`，D1 未配置、接口异常或某栏目未发布时自动回退到 `src/data/*` 的内置默认内容。
- 微信二维码等二进制媒体继续使用 R2，不写回 Git；团队、项目和新闻图片可使用站内构建资源或公开 HTTPS 地址。
- `admin_audit_logs` 记录登录、退出、口令修改、部署侧恢复、内容更新和二维码上传；记录时间、IP、User-Agent、操作和结果，不记录口令或请求正文。

## 多人协作与发布治理

- 生产分支使用 PR 合并，建议启用至少 1 名审核人、过期审核自动撤销、必须通过 CI、分支必须最新、禁止强制推送和删除分支。
- `.github/CODEOWNERS` 将生产代码、内容结构和部署配置交由仓库维护者审核。
- PR 模板要求核对文案语境、链接、日期、图片、移动端与键盘操作。
- 生产部署由受保护的 `main` 合并触发；内容运营通过 `/admin` 和 D1/R2 完成，不直接修改线上数据库。

内容接口：

- `GET /api/content`：公开读取已发布内容，支持静态镜像跨域读取。
- `GET /api/admin/content`：管理员读取内容与版本元数据。
- `PUT /api/admin/content/:type`：管理员保存单个栏目，body 为 `{ content, expectedVersion }`。
- `POST /api/admin/password`：管理员验证当前口令后修改共享口令。
- `GET /api/admin/audit-logs`：读取最近的管理员操作记录。
