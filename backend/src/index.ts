import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { searchRouter } from './routes/search'
import { knowledgeRouter } from './routes/knowledge'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// 中间件配置
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 路由配置
app.use('/api/search', searchRouter)
app.use('/api/knowledge', knowledgeRouter)

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: '服务器内部错误' })
})

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
})