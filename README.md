# 314工作室官网 | EPIC 314 Website

北京建筑大学工程实践创新中心 314 工作室官方网站。

这是一个纯前端静态站点，用于展示工作室风采、团队成员、项目与机器人、赛事荣誉、教程资源、新闻动态和联系方式。

## 特性

- Linear 风格的静态官网
- Vue 3 + Vite + Vue Router
- 支持 GitHub Pages 和自有服务器双部署
- 服务器版本可显示备案信息，GitHub Pages 版本不显示
- 静态资料、图片和 PDF 随站点一起发布

## 项目结构

```text
epic314-website/
├── public/            # 静态文档、favicon、logo、备案图标
├── src/               # 页面、组件、路由、数据、样式
├── DESIGN.md          # UI 设计规范
├── .env.github        # GitHub Pages 构建配置
├── .env.server        # 服务器构建配置
└── .github/workflows/ # GitHub Pages 部署工作流
```

## 本地开发

安装依赖：

```bash
npm install
```

启动普通本地开发：

```bash
npm run dev
```

启动带备案信息的本地服务器版本：

```bash
npm run dev:server
```

默认地址：

```text
http://127.0.0.1:5173
```

## 构建命令

```bash
npm run build         # 默认构建
npm run build:github  # GitHub Pages 版本，不显示备案信息
npm run build:server  # 服务器版本，显示备案信息
npm run preview       # 预览 dist/
```

## 部署方式

### GitHub Pages

GitHub Pages 使用 `npm run build:github` 构建，部署到：

```text
https://miofelix.github.io/epic314-website/
```

工作流在 `.github/workflows/deploy.yml` 中配置，构建时会读取 `.env.github`，所以不会渲染备案信息。

### 自有服务器

服务器使用 `npm run build:server` 构建，读取 `.env.server`。

当前备案配置如下：

```text
VITE_SITE_BASE=/
VITE_SHOW_ICP=true
VITE_ICP_TEXT=京ICP备2025148902号-1
VITE_ICP_URL=https://beian.miit.gov.cn/
VITE_POLICE_TEXT=京公网安备 11011502038960号
VITE_POLICE_URL=https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11011502038960
```

公安备案图标使用本地静态文件 `public/gongan.png`，构建后会和 `dist/` 一起发布。

## 备案显示规则

- `VITE_SHOW_ICP=true` 时，页脚显示备案信息
- `VITE_SHOW_ICP=false` 时，页脚只显示版权信息
- GitHub Pages 使用 `.env.github`
- 服务器使用 `.env.server`

## 常用页面

- `/` 首页
- `/event` 赛事页
- `/about` 关于我们
- `/team` 团队成员
- `/contact` 联系我们

## 备注

- 站点首页图片和资源都来自 `public/` 与 `src/assets/`
- 路由基于 `import.meta.env.BASE_URL`，适配 GitHub Pages 子路径和服务器根路径
