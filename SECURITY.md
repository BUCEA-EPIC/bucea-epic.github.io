# 安全策略

## 报告安全问题

请不要在公开 Issue、PR 或聊天中披露可利用的安全细节、口令、密钥或个人信息。优先通过 GitHub 私密安全报告功能提交；如果该功能不可用，请联系 `contact@rayspace.org`，并提供复现步骤、影响范围和建议修复方式。

## 凭据处理

- Cloudflare API 凭据仅保存在 GitHub `production` Environment secrets 或本地 Wrangler 登录状态中。
- `ADMIN_PASSWORD` 是管理员共享口令的唯一配置来源；通过 GitHub `production` Environment 配置，并由受保护的恢复工作流同步到 D1。
- `ADMIN_SESSION_SECRET` 用于签发管理员会话，泄露后必须立即轮换。
- 管理员口令遗忘时，使用受保护的 GitHub Actions 恢复工作流，不要增加公网恢复接口。

## 支持版本

仅 `main` 当前生产版本接受安全修复。依赖更新由 Dependabot 提议，并须通过 CI 与代码审查。
