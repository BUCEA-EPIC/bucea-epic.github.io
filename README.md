# 314工作室官网 | EPIC 314 Website

**北京建筑大学 工程实践创新中心 314工作室官方网站**

前后端分离的现代化 Web 应用，展示工作室风采、团队成员、科研项目，并承载"萌新种子杯"等赛事的报名与作品提交功能。

---

## 主要功能

- **门户展示**：首页、关于我们、团队成员、项目展示、新闻动态、资源分享
- **赛事系统**：多赛道报名、团队/个人信息填报、大文件上传
- **后台管理**：管理员登录、提交记录查看、评分、标星、备注、文件下载
- **联系我们**：集成 SMTP 邮件服务

---

## 技术栈

**前端**: Vue 3 + Vite + Element Plus + Vue Router  
**后端**: FastAPI + SQLite + SQLAlchemy  
**静态部署**: GitHub Pages

---

## 项目结构

```
epic314-website/
├── vue3/              # 前端项目
│   ├── src/           # 组件、视图、资源
│   └── public/        # 静态资源
└── fastapi/           # 后端项目
    ├── app/           # 核心代码
    │   ├── core/      # 配置、数据库、安全
    │   ├── models/    # 数据模型
    │   ├── routers/   # API 路由
    │   └── utils/     # 工具函数
    └── uploads/       # 上传文件存储
```

---

## 使用说明

### 1. 准备环境

后端配置读取 `fastapi/.env`。可先复制模板并填写真实值：

```bash
cp fastapi/.env.example fastapi/.env
cd fastapi
python3 -m venv .venv
```

至少需要配置 `ADMIN_KEY`、`SMTP_USER`、`SMTP_PASS` 和 `TO_EMAIL`。

### 2. 启动后端

```bash
cd fastapi
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

启动后访问 `http://127.0.0.1:8000/docs` 查看接口文档。

### 3. 启动前端

```bash
cd vue3
npm install
npm run dev
```

前端默认运行在 `http://127.0.0.1:5173`。开发环境下，`/api` 请求会自动代理到后端 `8000` 端口。

### 4. 常用入口

- 首页：`/`
- 赛事页：`/event`
- 管理后台：`/admin`
- 后端文档：`/docs`

### 5. 常用命令

- `cd vue3 && npm run build`：构建前端生产包
- `cd vue3 && npm run preview`：预览构建结果
- `cd fastapi && .venv/bin/python -m compileall app`：检查后端 Python 语法

---

## 部署

当前生产部署只保留 GitHub Pages 静态前端，地址为：

```text
https://fyfelix.github.io/epic314-website/
```

### GitHub Pages

1. 在仓库 `Settings -> Pages` 中把 `Source` 设为 `GitHub Actions`
2. 将代码推送到 `main` 分支，工作流会自动构建并发布 `vue3/dist`
3. 如果以后仓库名变了，需要同步修改 `vue3/vite.config.js` 中的 `base`

本地验证 GitHub Pages 构建：

```bash
cd vue3
GITHUB_PAGES=true npm run build
npm run preview
```

注意：GitHub Pages 只能托管静态文件，不运行 FastAPI。`/api`、后台登录、邮件发送和提交管理等后端功能需要独立部署后再接入。

---

## 配置说明

后端配置从环境变量或 `fastapi/.env` 读取。可参考 `fastapi/.env.example` 创建本地配置：

- `ADMIN_KEY`: 管理员登录密钥，必须设置
- `SMTP_*`、`TO_EMAIL`: 联系表单邮件服务配置
- `UPLOAD_DIR`、`DB_PATH`: 上传目录与 SQLite 数据库路径
- `CORS_ALLOW_ORIGINS`: 允许访问 API 的前端域名，多个值用英文逗号分隔

---

## 版权信息

前端页脚从 2025 年开始动态生成当前版权年份。
