import OpenAI from 'openai'

export class EmbeddingService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL
    })
  }

  async getEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
        input: text
      })

      return response.data[0].embedding
    } catch (error) {
      console.error('获取嵌入向量失败:', error)
      throw error
    }
  }

  async getEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const response = await this.openai.embeddings.create({
        model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
        input: texts
      })

      return response.data.map(item => item.embedding)
    } catch (error) {
      console.error('批量获取嵌入向量失败:', error)
      throw error
    }
  }
}