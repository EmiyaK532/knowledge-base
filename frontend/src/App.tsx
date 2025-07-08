import { useState } from 'react'
import { Layout, Input, Button, Card, List, Typography, Space, Spin, message, Switch, Tag } from 'antd'
import { SendOutlined, BookOutlined, RobotOutlined, SearchOutlined } from '@ant-design/icons'
import axios from 'axios'
import './App.css'

const { Header, Content } = Layout
const { TextArea } = Input
const { Title, Text, Paragraph } = Typography

interface SearchResult {
  id: string
  content: string
  score: number
  metadata?: any
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  searchResults?: SearchResult[]
}

function App() {
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [useKnowledgeBase, setUseKnowledgeBase] = useState(true)
  const [currentResponse, setCurrentResponse] = useState('')

  const handleSearch = async () => {
    if (!query.trim()) {
      message.warning('请输入搜索内容')
      return
    }

    const userMessage: Message = { role: 'user', content: query }
    setMessages(prev => [...prev, userMessage])
    setQuery('')
    setLoading(true)
    setCurrentResponse('')

    try {
      const response = await fetch('http://localhost:3000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          useKnowledgeBase: useKnowledgeBase
        }),
      })

      if (!response.ok) throw new Error('搜索失败')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedResponse = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.type === 'content') {
                  accumulatedResponse += data.content
                  setCurrentResponse(accumulatedResponse)
                } else if (data.type === 'searchResults') {
                  // 处理搜索结果
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: accumulatedResponse
      }
      setMessages(prev => [...prev, assistantMessage])
      setCurrentResponse('')
    } catch (error) {
      message.error('搜索出错，请稍后重试')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header className="bg-white shadow-md px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOutlined className="text-2xl text-blue-600" />
          <Title level={3} className="!mb-0 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            智能知识库
          </Title>
        </div>
        <Space>
          <Text>知识库模式</Text>
          <Switch
            checked={useKnowledgeBase}
            onChange={setUseKnowledgeBase}
            checkedChildren="开启"
            unCheckedChildren="关闭"
          />
        </Space>
      </Header>

      <Content className="p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6 shadow-lg rounded-lg">
            <Space direction="vertical" className="w-full" size="large">
              <TextArea
                placeholder="输入您的问题..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault()
                    handleSearch()
                  }
                }}
                autoSize={{ minRows: 3, maxRows: 6 }}
                className="text-lg"
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSearch}
                loading={loading}
                size="large"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 border-none hover:from-blue-600 hover:to-purple-600"
              >
                {loading ? '思考中...' : '发送'}
              </Button>
            </Space>
          </Card>

          <div className="space-y-4">
            {messages.map((message, index) => (
              <Card
                key={index}
                className={`shadow-md ${
                  message.role === 'user' 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <Space align="start" className="w-full">
                  {message.role === 'user' ? (
                    <SearchOutlined className="text-blue-500 text-xl mt-1" />
                  ) : (
                    <RobotOutlined className="text-purple-500 text-xl mt-1" />
                  )}
                  <div className="flex-1">
                    <Tag color={message.role === 'user' ? 'blue' : 'purple'} className="mb-2">
                      {message.role === 'user' ? '您' : 'AI助手'}
                    </Tag>
                    <Paragraph className="!mb-0 whitespace-pre-wrap">
                      {message.content}
                    </Paragraph>
                  </div>
                </Space>
              </Card>
            ))}

            {loading && currentResponse && (
              <Card className="shadow-md bg-white border-gray-200">
                <Space align="start" className="w-full">
                  <RobotOutlined className="text-purple-500 text-xl mt-1" />
                  <div className="flex-1">
                    <Tag color="purple" className="mb-2">AI助手</Tag>
                    <Paragraph className="!mb-0 whitespace-pre-wrap">
                      {currentResponse}
                      <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1" />
                    </Paragraph>
                  </div>
                </Space>
              </Card>
            )}

            {loading && !currentResponse && (
              <div className="text-center py-8">
                <Spin size="large" tip="AI正在思考中..." />
              </div>
            )}
          </div>
        </div>
      </Content>
    </Layout>
  )
}

export default App