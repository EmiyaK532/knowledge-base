# Qdrant 数据库连接指南

## 🎯 概述

智能知识库后端使用 Qdrant 作为向量数据库，用于存储和检索知识条目的向量表示。本文档提供了完整的数据库连接和配置指南。

## 🚀 快速启动

### 1. 启动 Qdrant 数据库

**方法一：使用提供的脚本**
```bash
cd backend
./scripts/start-qdrant.sh
```

**方法二：手动启动 Docker 容器**
```bash
docker run -d \
  --name qdrant-knowledge \
  -p 6333:6333 \
  -p 6334:6334 \
  -v qdrant_storage:/qdrant/storage \
  qdrant/qdrant
```

### 2. 启动后端服务

```bash
cd backend
npm run dev
# 或
pnpm dev
```

## 📊 连接状态说明

启动后端服务时，您将看到以下信息：

### ✅ 成功连接示例

```
🚀 正在启动智能知识库后端服务...

🔍 正在检查 Qdrant 数据库连接: http://localhost:6333
✅ Qdrant 数据库连接成功!
📊 当前集合数量: 1
📂 已有集合:
   1. knowledge-base

🚀 正在初始化向量集合...
📂 检查向量集合: knowledge-base
✅ 向量集合 "knowledge-base" 已存在
   - 向量数量: 0
   - 索引状态: green
✅ 向量集合初始化完成!

📊 向量数据库状态:
┌─────────────────────────────────────────────────────────┐
│  集合名称           │  向量数量     │  状态            │
├─────────────────────────────────────────────────────────┤
│  knowledge-base    │  N/A         │  ✅ 正常         │
└─────────────────────────────────────────────────────────┘

🎉 服务器启动成功!
🌐 服务地址: http://localhost:3000
🏥 健康检查: http://localhost:3000/health
📊 数据库状态: http://localhost:3000/api/database/status

✨ 智能知识库后端服务已就绪，可以开始使用!
```

### ❌ 连接失败示例

```
🚀 正在启动智能知识库后端服务...

🔍 正在检查 Qdrant 数据库连接: http://localhost:6333
❌ Qdrant 数据库连接失败!
🔗 尝试连接: http://localhost:6333
💥 错误详情: 无法连接到 Qdrant 服务器

🛠️  故障排查建议:
1. 检查 Docker 容器是否运行:
   docker ps | grep qdrant

2. 如果容器未运行，启动 Qdrant:
   docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant

3. 检查端口是否被占用:
   lsof -i :6333

4. 验证连接 URL 配置:
   当前配置: http://localhost:6333
   环境变量: QDRANT_URL=未设置

5. 测试直接访问:
   curl http://localhost:6333/collections

6. 查看 Qdrant 容器日志:
   docker logs [container_id]

📚 更多信息请查看: https://qdrant.tech/documentation/

⚠️  警告: 数据库连接失败，但服务器仍将启动
📝 某些功能可能不可用，请检查数据库连接后重启服务

🌐 服务器运行在受限模式
🌐 服务地址: http://localhost:3000
🏥 健康检查: http://localhost:3000/health
📊 数据库状态: http://localhost:3000/api/database/status
```

## 🔧 配置选项

### 环境变量

在 `.env` 文件中配置：

```env
# Qdrant 数据库配置
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your-api-key-here  # 可选

# 服务器配置
PORT=3000

# OpenAI API (用于向量化)
OPENAI_API_KEY=your-openai-api-key
```

### 默认配置

- **数据库地址**: `http://localhost:6333`
- **集合名称**: `knowledge-base`
- **向量维度**: 1536 (OpenAI embedding)
- **距离算法**: Cosine

## 📡 API 端点

### 健康检查

```bash
GET http://localhost:3000/health
```

响应：
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "database": {
    "database": "Qdrant",
    "status": "connected",
    "url": "http://localhost:6333",
    "collections": 1,
    "health": "healthy"
  }
}
```

### 数据库状态

```bash
GET http://localhost:3000/api/database/status
```

响应：
```json
{
  "connected": true,
  "url": "http://localhost:6333",
  "collections": 1
}
```

## 🛠️ 故障排查

### 1. 检查 Docker 容器状态

```bash
# 查看运行中的容器
docker ps | grep qdrant

# 查看所有容器（包括停止的）
docker ps -a | grep qdrant

# 查看容器日志
docker logs qdrant-knowledge
```

### 2. 检查端口占用

```bash
# macOS/Linux
lsof -i :6333

# Windows
netstat -ano | findstr :6333
```

### 3. 测试直接连接

```bash
# 测试 API 连接
curl http://localhost:6333/collections

# 访问 Web 控制台
open http://localhost:6333/dashboard
```

### 4. 重启服务

```bash
# 停止容器
docker stop qdrant-knowledge

# 启动容器
docker start qdrant-knowledge

# 或删除并重新创建
docker rm qdrant-knowledge
./scripts/start-qdrant.sh
```

## 🔍 数据库管理

### Qdrant Web 控制台

访问 `http://localhost:6333/dashboard` 查看：
- 集合状态
- 向量数据
- 搜索测试
- 性能指标

### 数据持久化

数据存储在 Docker 卷 `qdrant_storage` 中，重启容器不会丢失数据。

```bash
# 查看存储卷
docker volume ls | grep qdrant

# 备份数据
docker run --rm -v qdrant_storage:/data -v $(pwd):/backup alpine tar czf /backup/qdrant-backup.tar.gz -C /data .

# 恢复数据
docker run --rm -v qdrant_storage:/data -v $(pwd):/backup alpine tar xzf /backup/qdrant-backup.tar.gz -C /data
```

## 📚 更多资源

- [Qdrant 官方文档](https://qdrant.tech/documentation/)
- [Qdrant Docker Hub](https://hub.docker.com/r/qdrant/qdrant)
- [向量搜索最佳实践](https://qdrant.tech/articles/)

## 🆘 常见问题

**Q: 为什么连接失败？**
A: 确保 Docker 运行并且 Qdrant 容器已启动。检查端口 6333 是否被占用。

**Q: 数据会丢失吗？**
A: 不会，数据存储在 Docker 卷中，重启不会丢失。

**Q: 如何重置数据库？**
A: 删除容器和卷：`docker rm qdrant-knowledge && docker volume rm qdrant_storage`

**Q: 可以使用远程 Qdrant 吗？**
A: 可以，设置环境变量 `QDRANT_URL` 指向远程地址。