# 光启Ray-space工作室官网

北京建筑大学光启Ray-space工作室官网，基于 Vue 3、Vite 和 Vue Router 构建。

## 开发

```bash
npm install
cp .dev.vars.example .dev.vars   # 配置本地管理口令
npm run dev
```

默认地址：`http://127.0.0.1:5173`

管理入口（不公开宣传）：`/admin`

## 构建

```bash
npm run build
npm run build:github
npm run build:server
```

## 目录

```text
src/                前端源码
worker/             Cloudflare Worker API（微信二维码管理）
public/             静态文档与公共资源
.github/workflows/  GitHub Pages 部署流程
DESIGN.md           视觉设计规范
```

## 部署说明

- `npm run build:github`：用于 GitHub Pages
- `npm run build:server`：用于服务器模式
- `npm run preview`：通过 Wrangler 本地预览构建结果
- `npm run deploy`：构建并部署到 Cloudflare（含 Worker API）

### 微信招新群二维码（Cloudflare）

二维码约 7 天失效，运营同学通过主站 `/admin` 上传替换，无需改代码发版。

首次部署前：

1. 创建 R2 存储桶（名称与 `wrangler.jsonc` 中一致）：

```bash
npx wrangler r2 bucket create bucea-epic-wechat-qr
```

2. 配置密钥（勿写入仓库）：

```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_SESSION_SECRET
```

3. 部署：

```bash
npm run deploy
```

GitHub Pages 等纯静态部署通过 `VITE_API_BASE=https://rayspace.org` 读取主站公开 API；管理上传请在 `https://rayspace.org/admin` 完成。
