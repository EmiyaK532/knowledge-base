import { Router } from 'express'
import { VectorService } from '../services/vectorService'
import { LLMService } from '../services/llmService'

export const searchRouter = Router()

searchRouter.post('/', async (req, res) => {
  const { query, useKnowledgeBase = true } = req.body

  if (!query) {
    return res.status(400).json({ error: '查询内容不能为空' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    let context = ''
    
    if (useKnowledgeBase) {
      const vectorService = new VectorService()
      const searchResults = await vectorService.hybridSearch(query)
      
      // 发送搜索结果
      res.write(`data: ${JSON.stringify({ type: 'searchResults', results: searchResults })}\n\n`)
      
      // 构建上下文
      context = searchResults
        .map(result => result.content)
        .join('\n\n')
    }

    // 使用LLM生成回答
    const llmService = new LLMService()
    const stream = await llmService.generateStreamResponse(query, context)

    // 流式传输响应
    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ type: 'content', content: chunk })}\n\n`)
    }

    res.write('data: [DONE]\n\n')
    res.end()
  } catch (error) {
    console.error('搜索错误:', error)
    res.write(`data: ${JSON.stringify({ type: 'error', error: '搜索过程中出现错误' })}\n\n`)
    res.end()
  }
})