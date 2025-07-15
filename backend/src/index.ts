import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {
  hybridSearch,
  rerankDocuments,
  generateMessage,
} from "./services/index";
import { vectorFormat, rerankedFormat } from "./utils/common";
import initQdrant from "./utils/db";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // 允许跨域

// 根路径 - 显示 API 信息
app.get("/", (req, res) => {
  res.json({
    message: "智能知识库 API 服务",
    version: "1.0.0",
    endpoints: {
      search: "POST /api/search - 搜索知识库",
      health: "GET /health - 健康检查",
    },
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

// 健康检查端点
app.get("/health", async (req, res) => {
  try {
    // 检查 Qdrant 数据库连接
    const qdrant = await initQdrant();
    const collections = await qdrant.getCollections();

    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: {
        database: "Qdrant",
        status: "connected",
        url: process.env.QDRANT_API_URL || "http://localhost:6333",
        collections: collections.collections.length,
        health: "healthy",
      },
    });
  } catch (error) {
    console.error("数据库连接检查失败:", error);
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: {
        database: "Qdrant",
        status: "disconnected",
        url: process.env.QDRANT_API_URL || "http://localhost:6333",
        collections: 0,
        health: "unhealthy",
      },
    });
  }
});

app.post("/api/search", async (req, res) => {
  const { query, useKnowledgeBase = true } = req.body;
  console.log(query, useKnowledgeBase);
  // 设置流式响应头
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  try {
    // 是否为知识库查询
    if (useKnowledgeBase) {
      // 混合查询
      const docs = await hybridSearch(query);
      console.log("搜索结果:", docs);

      // 暂时跳过重排序，直接使用搜索结果
      const documents = vectorFormat(docs);
      console.log("格式化文档:", documents);

      // 生成消息
      const messages = await generateMessage(query, documents);
      // 流式传输响应
      for await (const chunk of messages) {
        const content = chunk.choices[0]?.delta?.content || "";
        res.write(`data: ${JSON.stringify({ type: "content", content })}\n\n`);
      }
      res.end();
    } else {
      // 生成消息
      const messages = await generateMessage(query);
      // 流式传输响应
      for await (const chunk of messages) {
        const content = chunk.choices[0]?.delta?.content || "";
        res.write(`data: ${JSON.stringify({ type: "content", content })}\n\n`);
      }
      res.end();
    }
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: "API Error" });
    }
  }
});

// 错误处理中间件
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: "服务器内部错误" });
});

// 启动服务器
async function startServer() {
  try {
    console.log("🚀 正在启动智能知识库后端服务...");

    // 初始化数据库
    console.log("📂 初始化 Qdrant 数据库...");
    await initQdrant();
    console.log("✅ 数据库初始化完成");

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`🎉 服务器启动成功，监听端口：${port}`);
      console.log(`🌐 服务地址: http://localhost:${port}`);
      console.log(`🏥 健康检查: http://localhost:${port}/health`);
    });
  } catch (error) {
    console.error("❌ 服务器启动失败:", error);
    process.exit(1);
  }
}

startServer();
