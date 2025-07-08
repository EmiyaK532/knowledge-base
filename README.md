# 智能知识库系统

一个基于 Node.js + React + LLM 的智能知识库系统，支持向量搜索、混合检索和流式对话功能。

## 功能特性

- 🚀 **混合搜索**：结合向量搜索和文本搜索，提供更准确的检索结果
- 💬 **流式对话**：支持实时流式响应，提升用户体验
- 🎨 **现代化UI**：使用 React + Ant Design + Tailwind CSS 构建美观的界面
- 📚 **知识管理**：支持添加、删除、查询知识库内容
- 🤖 **多模型支持**：支持 OpenAI、阿里云百炼等多种 LLM
- 🔍 **向量数据库**：使用 Qdrant 进行高效的向量存储和检索

## 技术栈

### 前端
- React 19 + TypeScript
- Vite 构建工具
- Ant Design 组件库
- Tailwind CSS 样式框架
- Axios HTTP 客户端

### 后端
- Node.js + Express
- TypeScript
- Qdrant 向量数据库
- OpenAI API
- 流式响应 (SSE)

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8
- Docker (用于运行 Qdrant)

### 1. 克隆项目

```bash
git clone <repository-url>
cd knowledge-base
```

### 2. 启动 Qdrant 向量数据库

```bash
cd docker
docker-compose up -d
```

### 3. 配置环境变量

复制后端环境变量示例文件：

```bash
cd backend
cp .env.example .env
```

编辑 `.env` 文件，配置以下内容：

```env
# 服务器配置
PORT=3000

# Qdrant向量数据库配置
QDRANT_URL=http://localhost:6333

# OpenAI配置
OPENAI_API_KEY=your_openai_api_key
OPENAI_BASE_URL=https://api.openai.com/v1

# 模型配置
LLM_MODEL=gpt-3.5-turbo
EMBEDDING_MODEL=text-embedding-3-small
```

### 4. 安装依赖并启动

#### 后端

```bash
cd backend
pnpm install
pnpm dev
```

#### 前端

```bash
cd frontend
pnpm install
pnpm dev
```

### 5. 访问应用

打开浏览器访问 http://localhost:5173

## 项目结构

```
knowledge-base/
├── frontend/               # 前端项目
│   ├── src/
│   │   ├── App.tsx        # 主应用组件
│   │   ├── index.css      # 全局样式
│   │   └── main.tsx       # 入口文件
│   ├── package.json
│   └── vite.config.ts
├── backend/               # 后端项目
│   ├── src/
│   │   ├── index.ts       # 服务器入口
│   │   ├── routes/        # 路由定义
│   │   │   ├── search.ts  # 搜索接口
│   │   │   └── knowledge.ts # 知识管理接口
│   │   └── services/      # 业务服务
│   │       ├── vectorService.ts    # 向量数据库服务
│   │       ├── embeddingService.ts # 嵌入向量服务
│   │       └── llmService.ts       # LLM服务
│   ├── package.json
│   └── tsconfig.json
├── docker/                # Docker配置
│   └── docker-compose.yml
└── README.md
```

## API 接口

### 搜索接口

**POST** `/api/search`

请求体：
```json
{
  "query": "搜索内容",
  "useKnowledgeBase": true
}
```

响应：流式 SSE 响应

### 知识管理接口

**POST** `/api/knowledge/add` - 添加知识

```json
{
  "content": "知识内容",
  "metadata": {}
}
```

**GET** `/api/knowledge/list` - 获取知识列表

**DELETE** `/api/knowledge/:id` - 删除知识

## 使用说明

1. **添加知识**：通过 API 或界面添加知识到知识库
2. **智能问答**：在界面输入问题，系统会基于知识库内容生成回答
3. **知识库模式**：可以开启/关闭知识库模式，关闭时直接使用 LLM 回答

## 部署

### 生产环境构建

#### 前端构建
```bash
cd frontend
pnpm build
```

#### 后端构建
```bash
cd backend
pnpm build
pnpm start
```

### Docker 部署

可以使用 Docker 容器化部署，具体配置请参考项目中的 Dockerfile。

## 注意事项

1. 确保 OpenAI API Key 有效且有足够的额度
2. Qdrant 数据库需要持续运行，数据存储在 `docker/qdrant_storage` 目录
3. 生产环境建议使用 HTTPS 和适当的安全配置
4. 可以根据需要调整嵌入模型和 LLM 模型

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License