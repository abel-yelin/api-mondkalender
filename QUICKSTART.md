# 快速开始指南

## 本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:3000 启动。

### 3. 测试 API

打开浏览器或使用 curl 测试：

```bash
# 健康检查
curl http://localhost:3000/api/health

# 获取今日月相
curl http://localhost:3000/api/moon/today

# 获取详细信息（柏林）
curl "http://localhost:3000/api/moon/day-info?latitude=52.52&longitude=13.405"
```

## Docker 快速部署

### 使用 Docker Compose（推荐）

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f moon-api

# 停止
docker-compose down
```

### 手动 Docker 部署

```bash
# 构建
docker build -t moon-api .

# 运行
docker run -d -p 3000:3000 --name moon-api moon-api

# 查看日志
docker logs -f moon-api
```

## 在 Dokploy 上部署

### 前置准备

1. 将代码推送到 Git 仓库（GitHub/GitLab/Gitea 等）
2. 确保 Dokploy 已安装并运行

### 部署步骤

1. **在 Dokploy 中创建应用**
   - 打开 Dokploy 管理面板
   - 点击 "Create Application"
   - 选择 "Docker" 类型

2. **连接 Git 仓库**
   - 输入仓库 URL
   - 选择分支（通常是 `main`）
   - 添加访问凭证（如果是私有仓库）

3. **配置构建**
   - Build Type: Dockerfile
   - Dockerfile Path: `./Dockerfile`

4. **设置环境变量**
   ```
   NODE_ENV=production
   PORT=3000
   ALLOWED_ORIGIN=https://your-frontend.com
   ```

5. **配置端口**
   - Container Port: 3000
   - Host Port: 自动分配或指定

6. **（可选）绑定域名**
   - 添加域名：`api.yourdomain.com`
   - 启用 SSL（Let's Encrypt）

7. **部署**
   - 点击 "Deploy" 按钮
   - 等待构建完成（约 2-5 分钟）

8. **验证部署**
   ```bash
   curl https://your-api-domain.com/api/health
   ```

### 自动部署设置

1. 在 Dokploy 中找到 Webhook URL
2. 在 Git 仓库设置中添加 Webhook
3. 每次推送代码后自动重新部署

## 环境变量说明

创建 `.env` 文件：

```env
# 必需
NODE_ENV=production
PORT=3000

# CORS 配置（重要！）
ALLOWED_ORIGIN=https://your-frontend.com
# 或者允许所有源（仅用于开发）
# ALLOWED_ORIGIN=*

# 可选
NEXT_TELEMETRY_DISABLED=1
```

## API 测试示例

### 获取今日月相
```bash
curl https://your-api.com/api/moon/today
```

### 获取特定日期的月相
```bash
curl "https://your-api.com/api/moon/today?date=2024-01-01"
```

### 获取详细信息（需要位置）
```bash
# 柏林
curl "https://your-api.com/api/moon/day-info?date=2024-01-01&latitude=52.52&longitude=13.405"

# 北京
curl "https://your-api.com/api/moon/day-info?date=2024-01-01&latitude=39.9&longitude=116.4"
```

### 获取月份数据
```bash
# 2024 年 1 月（month=0）
curl "https://your-api.com/api/moon/month?year=2024&month=0"
```

### 获取日期范围
```bash
curl "https://your-api.com/api/moon/calendar?startDate=2024-01-01&endDate=2024-01-31"
```

## 常见问题

### Q: 如何修改端口？
A: 修改 `.env` 文件中的 `PORT` 变量，或在 Docker 中映射不同端口。

### Q: CORS 错误怎么办？
A: 确保 `ALLOWED_ORIGIN` 环境变量设置为你的前端域名。开发时可以设为 `*`。

### Q: native 模块编译失败？
A: 确保使用 Node.js 18+ 并且在 Docker 环境中有编译工具（Dockerfile 已包含）。

### Q: 如何查看日志？
A:
- 本地：查看控制台输出
- Docker：`docker logs -f <container-name>`
- Dokploy：在面板中点击应用查看日志

### Q: 部署后 API 无法访问？
A: 检查：
1. 防火墙是否允许端口
2. 域名是否正确解析
3. Dokploy 反向代理配置
4. 容器是否正常运行

## 下一步

- 阅读完整的 [README.md](./README.md) 了解详细 API 文档
- 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解详细部署指南
- 在前端集成 API（参考 README 中的示例代码）

## 获取帮助

遇到问题？
1. 检查日志输出
2. 查看完整文档
3. 提交 GitHub Issue
