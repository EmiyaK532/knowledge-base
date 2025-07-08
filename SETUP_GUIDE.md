# 智能知识库完整部署指南

## 🎯 项目概述

这是一个基于 React + Express + Qdrant 的智能知识库系统，具有完整的表单功能、向量搜索和错误处理机制。

## 📁 项目结构

```
knowledge-base/
├── frontend/                 # React 前端应用
│   ├── src/
│   │   ├── components/forms/ # 表单组件 (React Hook Form + Zod)
│   │   ├── pages/           # 页面组件
│   │   ├── utils/           # 工具函数 (错误处理)
│   │   └── hooks/           # 自定义 Hooks
│   └── FORMS_README.md      # 表单功能文档
├── backend/                  # Express 后端服务
│   ├── src/
│   │   ├── services/        # 业务服务 (向量、数据库、AI)
│   │   └── routes/          # API 路由
│   ├── scripts/             # 启动脚本
│   └── DATABASE_README.md   # 数据库连接指南
└── SETUP_GUIDE.md           # 本文档
```

## 🚀 快速开始

### 1. 环境准备

确保您的系统已安装：
- **Node.js** (≥18.0.0)
- **pnpm** (≥8.0.0) 
- **Docker** (用于 Qdrant 数据库)

### 2. 启动 Qdrant 数据库

```bash
# 进入后端目录
cd knowledge-base/backend

# 启动 Qdrant 数据库
./scripts/start-qdrant.sh

# 或手动启动
docker run -d \
  --name qdrant-knowledge \
  -p 6333:6333 \
  -p 6334:6334 \
  -v qdrant_storage:/qdrant/storage \
  qdrant/qdrant
```

### 3. 启动后端服务

```bash
cd knowledge-base/backend

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

**成功启动后，您将看到：**

```
🚀 正在启动智能知识库后端服务...

🔍 正在检查 Qdrant 数据库连接: http://localhost:6333
✅ Qdrant 数据库连接成功!
📊 当前集合数量: 1

🚀 正在初始化向量集合...
✅ 向量集合初始化完成!

🎉 服务器启动成功!
🌐 服务地址: http://localhost:3000
🏥 健康检查: http://localhost:3000/health
📊 数据库状态: http://localhost:3000/api/database/status

✨ 智能知识库后端服务已就绪，可以开始使用!
```

### 4. 启动前端应用

```bash
cd knowledge-base/frontend

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 5. 访问应用

打开浏览器访问：
- **前端应用**: http://localhost:5173
- **后端 API**: http://localhost:3000
- **Qdrant 控制台**: http://localhost:6333/dashboard

## 🔧 功能验证

### 1. 系统状态检查

访问 **http://localhost:5173/test** 查看：
- ✅ 后端服务连接状态
- ✅ Qdrant 数据库连接状态  
- ✅ 表单功能演示
- ✅ 错误处理测试

### 2. 表单功能测试

| 页面 | 功能 | 地址 |
|------|------|------|
| 智能对话 | 原聊天界面 | `/` |
| 知识管理 | 知识条目添加、搜索 | `/knowledge` |
| 用户设置 | 个性化配置 | `/settings` |
| 表单测试 | 功能演示和状态检查 | `/test` |

### 3. API 端点测试

```bash
# 健康检查
curl http://localhost:3000/health

# 数据库状态
curl http://localhost:3000/api/database/status

# 添加知识条目
curl -X POST http://localhost:3000/api/knowledge/add \
  -H "Content-Type: application/json" \
  -d '{
    "content": "这是测试内容",
    "metadata": {
      "title": "测试标题",
      "category": "tech",
      "tags": ["test"]
    }
  }'
```

## 🛠️ 故障排查

### 后端服务问题

**现象**: 前端显示"后端服务连接失败"

**解决方案**:
1. 检查后端服务是否启动: `cd backend && pnpm dev`
2. 检查端口占用: `lsof -i :3000`
3. 查看后端日志输出

### 数据库连接问题

**现象**: 显示"Qdrant 数据库连接失败"

**解决方案**:
1. 启动 Qdrant: `./scripts/start-qdrant.sh`
2. 检查 Docker 容器: `docker ps | grep qdrant`
3. 检查端口占用: `lsof -i :6333`
4. 访问控制台: http://localhost:6333/dashboard

### 前端构建问题

**现象**: 前端启动失败或类型错误

**解决方案**:
1. 重新安装依赖: `rm -rf node_modules && pnpm install`
2. 检查 TypeScript 配置
3. 查看控制台错误信息

## 📚 技术栈详情

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.1.0 | UI 框架 |
| TypeScript | 5.8.3 | 类型检查 |
| React Hook Form | 7.60.0 | 表单处理 |
| Zod | 3.25.76 | 表单验证 |
| Ant Design | 5.26.4 | UI 组件库 |
| React Router | 7.6.3 | 路由管理 |
| Zustand | 5.0.6 | 状态管理 |
| Tailwind CSS | 3.x | 样式框架 |

### 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | 18+ | 运行环境 |
| Express | 4.21.2 | Web 框架 |
| TypeScript | 5.8.3 | 类型检查 |
| Qdrant | latest | 向量数据库 |
| OpenAI API | 5.8.2 | 文本向量化 |

### 核心特性

- ✅ **强类型支持** - 完整的 TypeScript 类型定义
- ✅ **表单验证** - Zod 架构验证 + 友好错误提示
- ✅ **错误处理** - 统一的错误处理机制
- ✅ **响应式设计** - 支持桌面端和移动端
- ✅ **向量搜索** - 基于 Qdrant 的语义搜索
- ✅ **实时状态** - 服务和数据库状态监控

## 🔐 环境配置

### 后端环境变量 (.env)

```env
# 服务器配置
PORT=3000

# Qdrant 数据库
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=

# OpenAI API (用于向量化)
OPENAI_API_KEY=your-openai-api-key-here
```

### 前端环境变量 (.env)

```env
# API 地址
VITE_API_BASE_URL=http://localhost:3000
```

## 📈 性能优化

### 前端优化

- ✅ 代码分割和懒加载
- ✅ 表单状态优化 (React Hook Form)
- ✅ 组件缓存 (React.memo)
- ✅ 错误边界保护

### 后端优化

- ✅ 向量缓存机制
- ✅ 连接池管理
- ✅ 错误恢复机制
- ✅ 健康检查端点

## 🚢 生产部署

### Docker 部署

```bash
# 构建前端
cd frontend && pnpm build

# 构建后端
cd backend && pnpm build

# 使用 Docker Compose
docker-compose up -d
```

### 环境变量配置

生产环境需要配置：
- OpenAI API 密钥
- Qdrant 生产实例
- 域名和 HTTPS 配置

## 📞 技术支持

如果遇到问题：

1. 查看 `/test` 页面的系统状态
2. 检查浏览器控制台错误
3. 查看后端服务日志
4. 参考各模块的 README 文档

---

**注意**: 这是一个基于学习和实验目的的项目。在生产环境使用前，请进行充分的安全评估和性能测试。