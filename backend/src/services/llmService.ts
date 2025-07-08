import OpenAI from 'openai'

export class LLMService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL
    })
  }

  async *generateStreamResponse(query: string, context: string = '') {
    const systemPrompt = context
      ? `你是一个智能助手。请基于以下知识库内容回答用户的问题。如果知识库中没有相关信息，请诚实地说你不知道。

知识库内容：
${context}

请用简洁、准确的方式回答问题。`
      : '你是一个智能助手。请用专业、准确的方式回答用户的问题。'

    try {
      const stream = await this.openai.chat.completions.create({
        model: process.env.LLM_MODEL || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 2000
      })

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content
        if (content) {
          yield content
        }
      }
    } catch (error) {
      console.error('LLM生成响应失败:', error)
      throw error
    }
  }

  async generateResponse(query: string, context: string = '') {
    const systemPrompt = context
      ? `你是一个智能助手。请基于以下知识库内容回答用户的问题。如果知识库中没有相关信息，请诚实地说你不知道。

知识库内容：
${context}

请用简洁、准确的方式回答问题。`
      : '你是一个智能助手。请用专业、准确的方式回答用户的问题。'

    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.LLM_MODEL || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })

      return response.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('LLM生成响应失败:', error)
      throw error
    }
  }
}