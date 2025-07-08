import { Router } from 'express'
import { VectorService } from '../services/vectorService'

export const knowledgeRouter = Router()

// 添加知识
knowledgeRouter.post('/add', async (req, res) => {
  const { content, metadata = {} } = req.body

  if (!content) {
    return res.status(400).json({ error: '内容不能为空' })
  }

  try {
    const vectorService = new VectorService()
    const result = await vectorService.addDocument(content, metadata)
    res.json({ success: true, id: result })
  } catch (error) {
    console.error('添加知识错误:', error)
    res.status(500).json({ error: '添加知识失败' })
  }
})

// 删除知识
knowledgeRouter.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const vectorService = new VectorService()
    await vectorService.deleteDocument(id)
    res.json({ success: true })
  } catch (error) {
    console.error('删除知识错误:', error)
    res.status(500).json({ error: '删除知识失败' })
  }
})

// 获取所有知识
knowledgeRouter.get('/list', async (req, res) => {
  const { limit = 100, offset = 0 } = req.query

  try {
    const vectorService = new VectorService()
    const results = await vectorService.listDocuments(Number(limit), Number(offset))
    res.json({ success: true, data: results })
  } catch (error) {
    console.error('获取知识列表错误:', error)
    res.status(500).json({ error: '获取知识列表失败' })
  }
})