# 314工作室官网 | EPIC 314 Website

[](https://vuejs.org/)
[](https://element-plus.org/)
[](https://fastapi.tiangolo.com/)
[](https://www.python.org/)

**北京建筑大学 工程实践创新中心 314工作室官方网站**

本项目是一个前后端分离的现代化 Web 应用，旨在展示工作室风采、团队成员、科研项目，并承载“萌新种子杯”等赛事的报名与作品提交功能。

-----

## ✨ 主要功能

  * **门户展示**：包含首页、关于我们、团队成员、项目展示、新闻动态、资源分享等模块。
  * **赛事系统 ("萌新种子杯")**：
      * 支持多赛道（视觉、电源、建模）选择。
      * 团队/个人信息填报。
      * 大文件上传（支持断点续传/大文件流式处理）。
  * **后台管理系统**：
      * 管理员鉴权登录。
      * 查看、筛选、搜索提交记录。
      * **作品评分**、**标星收藏**、**备注管理**。
      * 安全下载学生提交的附件（解决中文文件名乱码问题）。
  * **联系我们**：集成 SMTP 邮件服务，用户留言自动发送至管理员邮箱。
  * **响应式设计**：完美适配 PC 端与移动端访问。

-----

## 🛠️ 技术栈

### 前端 (Frontend)

  * **框架**: Vue 3 (Composition API)
  * **构建工具**: Vite
  * **UI 组件库**: Element Plus
  * **路由**: Vue Router 4
  * **动画/特效**: CSS3 Animations, tsParticles (粒子特效)
  * **网络请求**: Fetch API (原生)

### 后端 (Backend)

  * **框架**: FastAPI (Python)
  * **数据库**: SQLite (轻量级，无需额外配置)
  * **ORM**: SQLAlchemy
  * **服务器**: Uvicorn (ASGI)
  * **工具库**: `email-validator` (验证), `python-multipart` (文件上传)

### 部署与运维

  * **反向代理**: Nginx (处理 HTTPS、静态资源托管、API 转发)
  * **脚本**: Windows Batch Script (自动化部署与数据同步)

-----

## 📂 目录结构

```text
epic314-website/
├── vue3/                   # 前端项目源码
│   ├── src/                # Vue 组件、视图、资源
│   ├── public/             # 静态资源 (favicon, doc等)
│   └── vite.config.js      # Vite 配置 (包含开发环境代理)
│
├── fastapi/                # 后端项目源码
│   ├── app/                # 核心代码包 (模块化结构)
│   │   ├── core/           # 配置、数据库连接、安全认证
│   │   ├── models/         # 数据库表模型定义
│   │   ├── routers/        # API 路由 (admin.py, public.py)
│   │   ├── utils/          # 工具函数 (邮件发送等)
│   │   └── main.py         # FastAPI 应用入口
│   ├── uploads/            # [自动生成] 用户上传的文件存储目录
│   ├── submissions.db      # [自动生成] SQLite 数据库文件
│   └── requirements.txt    # Python 依赖列表
│
├── nginx/                  # Nginx 配置文件示例
├── scripts/                # 自动化运维脚本 (部署、备份)
└── README.md               # 项目说明文档
```

-----

## 🚀 快速开始 (本地开发)

### 1\. 后端环境搭建 (FastAPI)

确保已安装 Python 3.8+。

```bash
cd fastapi

# 创建虚拟环境 (可选，但在 Windows 下推荐使用 Anaconda 或 venv)
python -m venv venv
# Windows 激活: venv\Scripts\activate
# Linux/Mac 激活: source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 启动后端服务 (热重载模式)
# 注意：由于代码结构调整，入口变为 app.main:app
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

*后端启动后，Swagger 文档地址：[http://127.0.0.1:8000/docs](https://www.google.com/search?q=http://127.0.0.1:8000/docs)*

### 2\. 前端环境搭建 (Vue 3)

确保已安装 Node.js 16+。

```bash
cd vue3

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

*前端启动后，访问地址通常为：http://localhost:5173*

> **注意**：`vite.config.js` 已配置代理，开发环境下前端请求 `/api` 会自动转发到本地 `8000` 端口，无需本地运行 Nginx。

-----

## 🚢 部署指南 (Linux Server)

### 1\. 后端部署

将 `fastapi` 文件夹上传至服务器（例如 `/home/fanyuo/fastapi`）。

```bash
# 在服务器上安装依赖
pip install -r requirements.txt

# 推荐使用 Systemd 或 Supervisor 管理进程
# 启动命令示例：
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 2\. 前端部署

在本地执行构建，然后将 `dist` 目录上传至服务器。

```bash
cd vue3
npm run build
# 生成的文件在 vue3/dist/
```

*可以使用 `scripts/vue3-deploy.bat` 脚本一键构建并上传。*

### 3\. Nginx 配置

参考 `nginx/epic314.bucea.online` 文件配置反向代理：

  * **静态文件**: 指向 `vue3/dist` 目录。
  * **API 转发**: 将 `/api/` 转发至 `http://127.0.0.1:8000/`。
  * **文件保护**: 配置 `/protected_files/` alias 用于安全下载。

-----

## 🛡️ 运维与备份

项目包含自动化脚本（位于 `scripts/` 目录）：

  * **`vue3-deploy.bat`**: 自动构建前端并发布到服务器。
  * **`sync_data.bat`**:
    1.  从服务器下载最新的上传文件 (`uploads/`)。
    2.  **安全备份** 服务器数据库 (使用 `sqlite3 .backup` 指令，防止热拷贝损坏)。
    3.  将备份的数据库还原到本地，方便进行数据分析或本地调试。

-----

## ⚙️ 关键配置

修改 `fastapi/app/core/config.py` 可调整以下参数：

  * `ADMIN_KEY`: 后台管理员登录密钥。
  * `SMTP_*`: 邮件发送服务器配置。
  * `UPLOAD_DIR`: 文件存储路径。

-----

## 📝 版权信息

© 2025 北京建筑大学 工程实践创新中心 314工作室. All Rights Reserved.