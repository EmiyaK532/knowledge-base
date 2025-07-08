#!/bin/bash

echo "🐳 启动 Qdrant 向量数据库..."

# 检查 Docker 是否运行
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker 未运行，请先启动 Docker"
    exit 1
fi

# 检查 Qdrant 容器是否已经运行
if docker ps | grep -q qdrant; then
    echo "✅ Qdrant 容器已在运行中"
    docker ps | grep qdrant
    exit 0
fi

# 检查是否存在停止的 Qdrant 容器
if docker ps -a | grep -q qdrant; then
    echo "🔄 发现已存在的 Qdrant 容器，正在重启..."
    docker start $(docker ps -a | grep qdrant | awk '{print $1}')
else
    echo "🚀 创建并启动新的 Qdrant 容器..."
    docker run -d \
        --name qdrant-knowledge \
        -p 6333:6333 \
        -p 6334:6334 \
        -v qdrant_storage:/qdrant/storage \
        qdrant/qdrant
fi

# 等待服务启动
echo "⏳ 等待 Qdrant 服务启动..."
sleep 5

# 检查服务状态
if curl -s http://localhost:6333/collections >/dev/null; then
    echo "✅ Qdrant 服务启动成功！"
    echo "🌐 Web UI: http://localhost:6333/dashboard"
    echo "📡 API: http://localhost:6333"
else
    echo "❌ Qdrant 服务启动失败，请检查 Docker 日志："
    echo "docker logs qdrant-knowledge"
    exit 1
fi