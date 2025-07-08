import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { searchRouter } from './routes/search'
import { knowledgeRouter } from './routes/knowledge'
import { DatabaseService } from './services/databaseService'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const databaseService = new DatabaseService()

// 中间件配置
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 路由配置
app.use('/api/search', searchRouter)
app.use('/api/knowledge', knowledgeRouter)

// 健康检查端点
app.get('/health', async (req, res) => {
  const dbInfo = await databaseService.getConnectionInfo()
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: dbInfo
  })
})

// 数据库状态端点
app.get('/api/database/status', async (req, res) => {
  try {
    const connectionInfo = await databaseService.checkConnection()
    res.json(connectionInfo)
  } catch (error: any) {
    res.status(500).json({ 
      error: '数据库状态检查失败', 
      details: error.message 
    })
  }
})

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: '服务器内部错误' })
})

// 启动服务器
async function startServer() {
  try {
    console.log('🚀 正在启动智能知识库后端服务...\n')
    
    // 检查数据库连接
    const connectionResult = await databaseService.checkConnection()
    
    if (connectionResult.connected) {
      // 初始化向量集合
      await databaseService.initializeCollections()
      
      // 启动服务器
      app.listen(PORT, () => {
        console.log('🎉 服务器启动成功!')
        console.log(`🌐 服务地址: http://localhost:${PORT}`)
        console.log(`🏥 健康检查: http://localhost:${PORT}/health`)
        console.log(`📊 数据库状态: http://localhost:${PORT}/api/database/status`)
        console.log(`\n✨ 智能知识库后端服务已就绪，可以开始使用!\n`)
      })
    } else {
      console.log('⚠️  警告: 数据库连接失败，但服务器仍将启动')
      console.log('📝 某些功能可能不可用，请检查数据库连接后重启服务\n')
      
      app.listen(PORT, () => {
        console.log('🌐 服务器运行在受限模式')
        console.log(`🌐 服务地址: http://localhost:${PORT}`)
        console.log(`🏥 健康检查: http://localhost:${PORT}/health`)
        console.log(`📊 数据库状态: http://localhost:${PORT}/api/database/status\n`)
      })
    }
  } catch (error: any) {
    console.error('❌ 服务器启动失败:', error.message)
    process.exit(1)
  }
}

// 优雅关闭处理
process.on('SIGINT', () => {
  console.log('\n🛑 收到关闭信号，正在优雅关闭服务器...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n🛑 收到终止信号，正在优雅关闭服务器...')
  process.exit(0)
})

// 启动服务器
startServer()