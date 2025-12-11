# HRT Recorder Server API 文档

## 概述

HRT Recorder Server 是一个基于 Cloudflare Workers 和 Hono 的服务器，提供数据存储和检索功能。数据存储在 Durable Objects 的 SQLite 数据库中。

## 认证

所有 API 请求都需要 HTTP Basic 认证。用户名和密码从环境变量 `USERNAME` 和 `PASSWORD` 中读取。

## API 端点

### POST /sync/data

存储 JSON 数据到数据库。

**请求**
- 方法: POST
- 路径: /sync/data
- 头部: Authorization: Basic <base64编码的用户名:密码>
- 内容类型: application/json
- 请求体: JSON 对象

**响应**
- 成功: 200 OK, 响应体: "Stored"
- 失败: 401 Unauthorized (认证失败)

**示例**
```bash
curl -X POST https://your-domain.com/sync/data \
  -H "Authorization: Basic dXNlcjpwYXNz" \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

### GET /sync/data

从数据库检索 JSON 数据。

**请求**
- 方法: GET
- 路径: /sync/data
- 头部: Authorization: Basic <base64编码的用户名:密码>

**响应**
- 成功: 200 OK, 响应体: 存储的 JSON 数据
- 未找到: 404 Not Found, 响应体: "Not found"
- 失败: 401 Unauthorized (认证失败)

**示例**
```bash
curl -H "Authorization: Basic dXNlcjpwYXNz" \
  https://your-domain.com/sync/data
```

## 部署

1. 安装依赖: `pnpm install`
2. 配置 wrangler: 设置环境变量 USERNAME 和 PASSWORD
3. 部署: `wrangler deploy`

## 注意事项

- 数据存储在单个记录中 (id=1)，每次 POST 会覆盖之前的数据。
- 使用 Cloudflare Durable Objects SQLite，需要付费计划或正确配置。