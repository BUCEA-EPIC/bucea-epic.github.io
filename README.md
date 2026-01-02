# 314工作室官网 | EPIC 314 Website

**北京建筑大学 工程实践创新中心 314工作室官方网站**

前后端分离的现代化 Web 应用，展示工作室风采、团队成员、科研项目，并承载"萌新种子杯"等赛事的报名与作品提交功能。

---

## ✨ 主要功能

- **门户展示**：首页、关于我们、团队成员、项目展示、新闻动态、资源分享
- **赛事系统**：多赛道报名、团队/个人信息填报、大文件上传
- **后台管理**：管理员登录、提交记录查看、评分、标星、备注、文件下载
- **联系我们**：集成 SMTP 邮件服务

---

## 🛠️ 技术栈

**前端**: Vue 3 + Vite + Element Plus + Vue Router  
**后端**: FastAPI + SQLite + SQLAlchemy  
**部署**: Nginx + Uvicorn

---

## 📂 项目结构

```
epic314-website/
├── vue3/              # 前端项目
│   ├── src/           # 组件、视图、资源
│   └── public/        # 静态资源
├── fastapi/           # 后端项目
│   ├── app/           # 核心代码
│   │   ├── core/      # 配置、数据库、安全
│   │   ├── models/    # 数据模型
│   │   ├── routers/   # API 路由
│   │   └── utils/     # 工具函数
│   └── uploads/       # 上传文件存储
├── nginx/             # Nginx 配置
└── scripts/           # 部署脚本
```

---

## 🚀 快速开始

### 后端启动

```bash
cd fastapi
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

后端启动后访问：http://127.0.0.1:8000/docs

### 前端启动

```bash
cd vue3
npm install
npm run dev
```

前端启动后访问：http://localhost:5173

> **注意**：开发环境下，前端请求 `/api` 会自动代理到后端 `8000` 端口。

---

## 🚢 部署

1. **后端部署**：将 `fastapi` 目录上传至服务器，安装依赖后使用 Uvicorn 启动
2. **前端部署**：执行 `npm run build` 构建，将 `dist` 目录上传至服务器
3. **Nginx 配置**：参考 `nginx/epic314.bucea.online` 配置反向代理

---

## ⚙️ 配置说明

修改 `fastapi/app/core/config.py` 配置：
- `ADMIN_KEY`: 管理员登录密钥
- `SMTP_*`: 邮件服务配置
- `UPLOAD_DIR`: 文件上传路径

---

## 📝 版权信息

© 2025 北京建筑大学 工程实践创新中心 314工作室. All Rights Reserved.
