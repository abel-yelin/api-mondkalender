# Dokploy 部署指南

本文档详细介绍如何将月相计算 API 部署到 Dokploy 环境中。

## 前置要求

1. **Dokploy 服务器**: 已安装并运行 Dokploy 的服务器
2. **Docker**: Dokploy 会自动处理 Docker 环境
3. **域名**（可选）: 用于绑定 API 的域名
4. **Git 仓库**: 将项目代码推送到 Git 仓库（GitHub、GitLab 等）

## 部署步骤

### 1. 准备代码仓库

首先，将项目推送到 Git 仓库：

```bash
# 初始化 Git 仓库（如果还没有）
git init

# 添加 .gitignore
cat > .gitignore << EOF
node_modules
.next
.env
.env.local
*.log
.DS_Store
EOF

# 提交代码
git add .
git commit -m "Initial commit: Moon calendar API"

# 推送到远程仓库
git remote add origin YOUR_GIT_REPO_URL
git push -u origin main
```

### 2. 在 Dokploy 中创建应用

1. **登录 Dokploy 面板**
   - 访问你的 Dokploy 管理界面（通常是 `https://your-server:3000`）

2. **创建新应用**
   - 点击 "Create Application" 或 "新建应用"
   - 选择 "Docker" 作为应用类型

3. **配置 Git 仓库**
   - Repository URL: 输入你的 Git 仓库地址
   - Branch: 选择部署分支（通常是 `main` 或 `master`）
   - 如果是私有仓库，添加 Deploy Key 或 Access Token

4. **配置构建设置**
   - Build Type: 选择 "Dockerfile"
   - Dockerfile Path: `./Dockerfile`（默认路径）

### 3. 配置环境变量

在 Dokploy 应用设置中添加以下环境变量：

```env
NODE_ENV=production
PORT=3000
ALLOWED_ORIGIN=https://your-frontend-domain.com
NEXT_TELEMETRY_DISABLED=1
```

**重要环境变量说明：**

- `NODE_ENV`: 设置为 `production`
- `PORT`: API 运行端口（默认 3000）
- `ALLOWED_ORIGIN`: 允许的前端域名，用于 CORS。可以设置为：
  - `*`: 允许所有域名（开发环境）
  - `https://your-domain.com`: 特定域名（生产环境推荐）
  - `https://domain1.com,https://domain2.com`: 多个域名（用逗号分隔）

### 4. 配置端口映射

在 Dokploy 中配置端口：

- **容器端口**: 3000
- **主机端口**: 选择一个可用端口（如 3001）或使用 Dokploy 的自动分配
- **协议**: HTTP

### 5. 配置域名（可选但推荐）

1. 在 Dokploy 中添加域名
2. 输入你的域名（如 `api.yourdomain.com`）
3. Dokploy 会自动配置 Nginx 反向代理
4. 如果需要 HTTPS，Dokploy 可以自动申请 Let's Encrypt 证书

### 6. 健康检查配置

Dokploy 应该自动检测 Dockerfile 中的 `HEALTHCHECK` 配置。确认健康检查设置：

- **路径**: `/api/health`
- **间隔**: 30 秒
- **超时**: 3 秒
- **重试次数**: 3 次

### 7. 部署应用

1. 点击 "Deploy" 或 "部署" 按钮
2. Dokploy 会：
   - 克隆 Git 仓库
   - 构建 Docker 镜像
   - 启动容器
   - 配置反向代理

3. 查看部署日志，确保没有错误

### 8. 验证部署

部署完成后，访问以下端点验证：

```bash
# 健康检查
curl https://your-api-domain.com/api/health

# 获取今日月相
curl https://your-api-domain.com/api/moon/today

# 获取特定日期信息（需要提供经纬度）
curl "https://your-api-domain.com/api/moon/day-info?date=2024-01-01&latitude=52.52&longitude=13.405"
```

## 使用 Docker Compose 部署（可选）

如果你更喜欢使用 Docker Compose，可以在 Dokploy 中选择 "Docker Compose" 部署方式：

1. 在 Dokploy 中选择 "Docker Compose"
2. 上传或粘贴 `docker-compose.yml` 文件内容
3. 配置环境变量
4. 点击部署

## 更新部署

### 自动部署（推荐）

在 Dokploy 中配置 Webhook 自动部署：

1. 在应用设置中找到 Webhook URL
2. 在 Git 仓库设置中添加 Webhook
3. 每次推送代码时，Dokploy 会自动重新部署

### 手动部署

1. 推送新代码到 Git 仓库
2. 在 Dokploy 面板中点击 "Redeploy" 或 "重新部署"

## 监控和日志

### 查看日志

在 Dokploy 面板中：
- 点击应用名称
- 选择 "Logs" 或"日志"标签
- 查看实时日志输出

### 监控资源使用

Dokploy 提供资源使用监控：
- CPU 使用率
- 内存使用量
- 网络流量

## 故障排查

### 容器启动失败

1. **检查日志**: 在 Dokploy 中查看容器日志
2. **验证环境变量**: 确保所有必需的环境变量已设置
3. **检查端口冲突**: 确保端口没有被其他服务占用

### 无法访问 API

1. **检查防火墙**: 确保服务器防火墙允许相应端口
2. **验证域名解析**: 确保域名正确指向服务器 IP
3. **检查 Nginx 配置**: 在 Dokploy 中查看反向代理配置

### Native 模块错误

如果遇到 `swisseph` 或其他 native 模块错误：

1. **确认 Dockerfile 正确**: 包含必要的构建工具
2. **检查 Node.js 版本**: 确保使用 Node.js 18 或更高版本
3. **重新构建**: 在 Dokploy 中触发完整重新构建

### CORS 错误

1. **检查 ALLOWED_ORIGIN**: 确保包含前端域名
2. **验证请求头**: 前端请求应包含正确的 Origin 头
3. **查看中间件日志**: 检查 CORS 中间件是否正确处理请求

## 性能优化

### 缓存配置

API 已内置内存缓存：
- 月相数据缓存 24 小时
- 自动清理过期缓存

### 扩展性

如果需要处理更多请求：

1. **增加副本数**: 在 Dokploy 中增加容器副本数量
2. **使用负载均衡**: Dokploy 会自动配置负载均衡
3. **外部缓存**（可选）: 集成 Redis 等外部缓存系统

## 安全建议

1. **限制 CORS 来源**: 不要在生产环境使用 `*`
2. **使用 HTTPS**: 强制使用 SSL/TLS
3. **定期更新**: 保持依赖包和 Docker 镜像更新
4. **监控日志**: 定期检查异常访问和错误

## 备份和恢复

### 数据备份

由于 API 是无状态的，主要备份：
- **代码**: 通过 Git 仓库自动备份
- **配置**: 导出 Dokploy 应用配置
- **环境变量**: 记录所有环境变量设置

### 快速恢复

1. 在 Dokploy 中重新创建应用
2. 连接相同的 Git 仓库
3. 恢复环境变量配置
4. 重新部署

## 支持和问题

如果遇到问题：
1. 检查 Dokploy 官方文档: https://dokploy.com/docs
2. 查看本项目的 README.md
3. 检查 GitHub Issues

---

**部署完成后，记得更新前端配置中的 API 地址！**
