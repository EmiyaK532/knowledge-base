import { QdrantClient } from '@qdrant/js-client-rest'
import { v4 as uuidv4 } from 'uuid'
import { EmbeddingService } from './embeddingService'

export class VectorService {
  private client: QdrantClient
  private collectionName = 'knowledge-base'
  private embeddingService: EmbeddingService

  constructor() {
    this.client = new QdrantClient({
      url: process.env.QDRANT_URL || 'http://localhost:6333',
      apiKey: process.env.QDRANT_API_KEY
    })
    this.embeddingService = new EmbeddingService()
  }

  async initCollection() {
    try {
      const collections = await this.client.getCollections()
      const exists = collections.collections.some(c => c.name === this.collectionName)

      if (!exists) {
        await this.client.createCollection(this.collectionName, {
          vectors: {
            size: 1536, // OpenAI embedding size
            distance: 'Cosine'
          }
        })
        console.log('向量集合创建成功')
      }
    } catch (error) {
      console.error('初始化集合失败:', error)
      throw error
    }
  }

  async addDocument(content: string, metadata: any = {}) {
    const id = uuidv4()
    const vector = await this.embeddingService.getEmbedding(content)

    await this.client.upsert(this.collectionName, {
      wait: true,
      points: [{
        id,
        vector,
        payload: {
          content,
          metadata,
          timestamp: new Date().toISOString()
        }
      }]
    })

    return id
  }

  async hybridSearch(query: string, limit = 10) {
    const queryVector = await this.embeddingService.getEmbedding(query)

    // 向量搜索
    const vectorResults = await this.client.search(this.collectionName, {
      vector: queryVector,
      limit,
      with_payload: true
    })

    // 文本搜索（基于payload中的content字段）
    const textResults = await this.client.search(this.collectionName, {
      vector: queryVector,
      limit,
      filter: {
        should: [{
          key: 'content',
          match: {
            text: query
          }
        }]
      },
      with_payload: true
    })

    // 合并并去重结果
    const resultMap = new Map()
    
    vectorResults.forEach(result => {
      resultMap.set(result.id, {
        id: result.id,
        score: result.score,
        content: result.payload?.content || '',
        metadata: result.payload?.metadata || {}
      })
    })

    textResults.forEach(result => {
      if (!resultMap.has(result.id)) {
        resultMap.set(result.id, {
          id: result.id,
          score: result.score * 0.8, // 文本搜索权重降低
          content: result.payload?.content || '',
          metadata: result.payload?.metadata || {}
        })
      }
    })

    // 按分数排序并返回
    return Array.from(resultMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  async deleteDocument(id: string) {
    await this.client.delete(this.collectionName, {
      wait: true,
      points: [id]
    })
  }

  async listDocuments(limit = 100, offset = 0) {
    const result = await this.client.scroll(this.collectionName, {
      limit,
      offset,
      with_payload: true
    })

    return result.points.map(point => ({
      id: point.id,
      content: point.payload?.content || '',
      metadata: point.payload?.metadata || {},
      timestamp: point.payload?.timestamp
    }))
  }
}