# 314工作室官网 | EPIC 314 Website

**北京建筑大学 工程实践创新中心 314工作室官方网站**

这是一个纯前端静态网站，用于展示工作室风采、团队成员、项目与机器人、赛事荣誉、教程资源、新闻动态和联系方式。

---

## 主要功能

- **门户展示**：首页、关于我们、团队成员、项目展示、新闻动态、资源分享
- **赛事介绍**：展示“萌新种子杯”赛道说明、获奖公示和命题文档
- **静态资料**：PDF 文档、图片资源和页面数据均随前端一起发布
- **静态部署**：通过 GitHub Pages 发布，无需后端服务

---

## 技术栈

**前端**: Vue 3 + Vite + Vue Router  
**静态部署**: GitHub Pages

---

## 项目结构

```text
epic314-website/
├── public/            # 静态文档、favicon、logo
├── src/               # 组件、视图、路由、数据、图片资源
├── DESIGN.md          # UI 设计规范
└── .github/workflows/ # GitHub Pages 部署工作流
```

---

## 使用说明

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

本地默认地址为 `http://127.0.0.1:5173`。

### 构建与预览

```bash
npm run build
npm run preview
```

常用入口：

- 首页：`/`
- 赛事页：`/event`
- 关于我们：`/about`
- 团队成员：`/team`
- 联系我们：`/contact`

---

## 部署

生产部署使用 GitHub Pages：

```text
https://fyfelix.github.io/epic314-website/
```

部署流程：

1. 仓库 `Settings -> Pages` 中将 `Source` 设置为 `GitHub Actions`
2. 推送到 `main` 分支后，工作流会自动构建并发布 `dist`
3. 如果仓库名变化，需要同步修改 `vite.config.js` 中的 `base`

本地验证 GitHub Pages 构建：

```bash
GITHUB_PAGES=true npm run build
npm run preview
```

---

## 版权信息

前端页脚从 2025 年开始动态生成当前版权年份。
