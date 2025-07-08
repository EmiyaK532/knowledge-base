import { Layout, Spin } from 'antd'
import { useChatStore } from '@/stores/chatStore'
import { Header } from '@/components/layout/Header'
import { ChatInput } from '@/components/chat/ChatInput'
import { MessageList } from '@/components/chat/MessageList'
import { WelcomeScreen } from '@/components/chat/WelcomeScreen'
import './App.css'

const { Content } = Layout

function App() {
  const {
    messages,
    loading,
    currentResponse,
    useKnowledgeBase,
    setUseKnowledgeBase,
    sendMessage,
  } = useChatStore()

  const handleSuggestionClick = (text: string) => {
    sendMessage(text)
  }

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header
        useKnowledgeBase={useKnowledgeBase}
        onKnowledgeBaseChange={setUseKnowledgeBase}
      />
      
      <Content className="flex flex-col h-[calc(100vh-64px)]">
        {messages.length === 0 && !loading ? (
          <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
        ) : (
          <MessageList
            messages={messages}
            currentResponse={currentResponse}
            loading={loading}
            className="flex-1"
          />
        )}
        
        <div className="border-t bg-white">
          <div className="max-w-4xl mx-auto p-4">
            <ChatInput
              onSend={sendMessage}
              loading={loading}
            />
          </div>
        </div>

        {loading && !currentResponse && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-5">
            <Spin size="large" tip="AI正在思考中..." />
          </div>
        )}
      </Content>
    </Layout>
  )
}

export default App