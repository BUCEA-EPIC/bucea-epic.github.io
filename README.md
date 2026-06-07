# EPIC 317 Website

北京建筑大学工程实践创新中心 317 工作室官网，基于 Vue 3、Vite 和 Vue Router 构建。

## 开发

```bash
npm install
npm run dev
```

默认地址：`http://127.0.0.1:5173`

## 构建

```bash
npm run build
npm run build:github
npm run build:server
```

## 目录

```text
src/                前端源码
public/             静态文档与公共资源
.github/workflows/  GitHub Pages 部署流程
DESIGN.md           视觉设计规范
```

## 部署说明

- `npm run build:github`：用于 GitHub Pages
- `npm run build:server`：用于服务器模式
- `npm run preview`：通过 Wrangler 本地预览构建结果
