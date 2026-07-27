# Repository Guidelines

## 项目概览

这是一个基于 Vue 3、Vite 和 Vue Router 的静态官网项目，用于展示北京建筑大学光启Ray-space工作室的团队、项目、活动、资源和新闻内容。

当前主要页面包括：

- `/` 首页
- `/event` 萌新种子杯
- `/about` 关于我们
- `/team` 团队成员
- `/projects` 项目与机器人
- `/resources` 教程与资源
- `/news` 新闻与动态
- `/contact` 联系我们

## 目录结构

- `src/`: 前端源码
- `src/components/`: 通用组件，如 `Navbar.vue`、`Footer.vue`
- `src/views/`: 页面组件，采用 `*View.vue` 命名
- `src/router/`: 路由配置
- `src/data/`: 静态数据模块
- `src/assets/`: 由 Vite 打包的图片资源
- `src/composables/`: 可复用逻辑，如滚动入场动效
- `public/`: 原样拷贝到产物目录的静态文件，含 PDF、favicon、备案图标等
- `.github/workflows/`: GitHub Pages 部署工作流
- `DESIGN.md`: 视觉设计规范
- `vite.config.js`: Vite 配置，包含别名、端口和 Cloudflare 插件
- `wrangler.jsonc`: Cloudflare 本地预览与部署配置

## 开发与构建命令

- `npm install`: 安装依赖
- `npm run dev`: 本地开发，默认端口 `5173`
- `npm run dev:server`: 以 `server` 模式本地开发
- `npm run build`: 默认生产构建
- `npm run build:github`: GitHub Pages 构建
- `npm run build:server`: 服务器模式构建
- `npm run preview`: 先构建，再通过 Wrangler 本地预览
- `npm run deploy`: 构建并执行 Wrangler 部署

## 代码风格与实现约定

- Vue、JavaScript、CSS 统一使用 2 空格缩进。
- 页面组件使用 PascalCase + `View.vue`，共享组件使用 PascalCase。
- 数据模块使用 camelCase 命名，例如 `teamData.js`、`newsData.js`。
- 优先复用现有组件、样式变量和 `src/composables/useRevealOnScroll.js` 等已有模式。
- 这是静态前端项目，除非明确需要，不要引入后端依赖或运行时服务。
- 修改时保持聚焦，避免无关重构和大规模格式化。

## 验证要求

当前没有测试框架。前端改动完成后，至少执行：

```bash
npm run build
```

如果改动涉及部署模式、备案显示或环境变量分支，补充执行对应命令，例如 `npm run build:github` 或 `npm run build:server`。

## 提交与 PR 约定

- 提交信息使用 Conventional Commits，例如 `feat:`、`fix:`、`refactor:`、`docs:`。
- 标题和正文使用简体中文，描述清楚改动目的和影响范围。
- 每次提交尽量保持单一目标，不混入无关文件。
- PR 说明应包含用户可见变更、验证方式，以及必要的截图。

## 配置与安全

- 不要提交任何密钥、令牌或私密配置。
- 页脚备案信息通过环境变量控制，GitHub Pages 与服务器模式可表现不同。
- 站点基路径由 `VITE_SITE_BASE` 控制，文档和路由需兼容子路径部署。
