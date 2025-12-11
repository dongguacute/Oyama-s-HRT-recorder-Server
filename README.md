# Oyama-s-HRT-recorder-Server

这是一个基于 Cloudflare Workers 和 Durable Objects 构建的 HRT记录服务器，使用 Hono 框架提供 API 服务，支持数据同步和持久化存储。

## 部署文档

### 前置要求

1. 安装 Node.js（推荐版本 18 或更高）。
2. 安装 pnpm：`npm install -g pnpm`。
3. 安装 Wrangler CLI：`npm install -g wrangler`。
4. 拥有 Cloudflare 账户，并确保账户有足够的 Workers 配额。
5. 登录 Wrangler：`wrangler auth login`。

### 部署步骤

1. **克隆项目**：
   ```bash
   git clone <repository-url>
   cd oyama-s-hrt-recorder-server
   ```

2. **安装依赖**：
   ```bash
   pnpm install
   ```

3. **设置环境变量（必需）**：

   本应用使用 Basic Authentication，需要设置用户名和密码：

   ```bash
   wrangler secret put USERNAME
   wrangler secret put PASSWORD
   ```

   当提示时，输入您想要的用户名和密码。这些将作为 API 的认证凭据。

4. **构建项目**：
   ```bash
   pnpm run build
   ```

5. **部署到 Cloudflare Workers**：
   ```bash
   pnpm run deploy
   ```

   或者手动执行：
   ```bash
   wrangler deploy
   ```

### 开发环境

- **启动开发服务器**：`pnpm run dev`
- **预览构建结果**：`pnpm run preview`
- **生成类型定义**：`pnpm run cf-typegen`

### API 说明

部署成功后，API 端点如下：

- **首页**：`GET /` - 显示简单的欢迎页面
- **同步数据**：
  - `POST /sync/data` - 上传 HRT 数据（需要认证）
  - `GET /sync/data` - 获取 HRT 数据（需要认证）

所有 `/sync/*` 端点都需要 Basic Authentication，使用您设置的 USERNAME 和 PASSWORD。

### 配置说明

- **主配置文件**：`wrangler.jsonc`
  - Durable Objects 绑定：`HRT_DATA` (类名: `HRTData`)
  - 兼容性日期：2023-01-01
  - Migrations：v1（初始化 HRTData 类）

- **环境变量**：
  - `USERNAME`：API 认证用户名
  - `PASSWORD`：API 认证密码

### 注意事项

- 部署后，应用将在 `https://my-app.<your-subdomain>.workers.dev` 可用（域名基于 wrangler.jsonc 中的 name 字段）。
- 如果需要自定义域名，请在 Cloudflare 控制台中配置路由。
- Durable Objects 提供数据持久化，确保数据在多次请求间保持一致。
- CORS 已配置为允许所有来源，便于前端应用访问。

### 故障排除

- **部署失败**：
  - 检查 Wrangler 登录状态：`wrangler auth status`
  - 确保已设置必需的 secrets（USERNAME 和 PASSWORD）
  - 查看构建日志以识别错误

- **认证问题**：
  - 确保使用正确的 Basic Auth 格式：`Authorization: Basic <base64-encoded-credentials>`
  - 凭据应为 `username:password` 的 base64 编码

- **其他问题**：
  - 确保所有依赖都已正确安装：`pnpm install`
  - 检查 Cloudflare 账户配额和权限
  - 查看 Worker 日志：`wrangler tail`
