# 协作规范

本仓库采用 Pull Request 协作。`main` 是受保护的生产分支，生产部署由合并后的 GitHub Actions 自动执行。

## 开发流程

1. 从最新 `main` 创建短生命周期分支，例如 `feat/content-editor` 或 `fix/api-cache-header`。
2. 聚焦单一变更，避免把无关格式化或重构混入同一个 PR。
3. 本地至少执行：

   ```bash
   npm ci --ignore-scripts
   npm run check:worker
   npm run build
   ```

4. 提交 PR，填写变更说明、验证结果和安全检查项，等待 CI 与代码审查通过后合并。

## 提交信息

使用 Conventional Commits，并用简体中文说明，例如：

- `feat: 增加新闻内容编辑能力`
- `fix: 修正二维码过期日期解析`
- `docs: 更新部署说明`

## 内容运营

团队、项目、教程资源、新闻和站点联系信息应通过 `/admin` 发布；微信招新群二维码只能通过后台上传到 R2，不要提交到 Git。发布前核对姓名、日期、链接、图片和状态，避免使用 `#` 或未经确认的占位内容。

## 安全

不得提交 `.dev.vars`、Cloudflare 凭据、管理员口令、会话密钥或其他令牌。安全问题请遵循 [SECURITY.md](SECURITY.md) 私下报告。
