import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { searchAPI, type StreamData } from '@/api/search'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  searchResults?: any[]
}

interface ChatStore {
  messages: Message[]
  loading: boolean
  currentResponse: string
  useKnowledgeBase: boolean
  
  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  setLoading: (loading: boolean) => void
  setCurrentResponse: (response: string) => void
  appendToCurrentResponse: (chunk: string) => void
  setUseKnowledgeBase: (use: boolean) => void
  clearMessages: () => void
  sendMessage: (query: string) => Promise<void>
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
  messages: [],
  loading: false,
  currentResponse: '',
  useKnowledgeBase: true,

  addMessage: (message) => {
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: Date.now().toString(),
          timestamp: new Date(),
        },
      ],
    }))
  },

  setLoading: (loading) => set({ loading }),
  
  setCurrentResponse: (response) => set({ currentResponse: response }),
  
  appendToCurrentResponse: (chunk) => {
    set((state) => ({ currentResponse: state.currentResponse + chunk }))
  },

  setUseKnowledgeBase: (use) => set({ useKnowledgeBase: use }),

  clearMessages: () => set({ messages: [], currentResponse: '' }),

  sendMessage: async (query) => {
    const { addMessage, setLoading, setCurrentResponse, appendToCurrentResponse, useKnowledgeBase } = get()
    
    if (!query.trim()) return

    // 添加用户消息
    addMessage({ role: 'user', content: query })
    
    // 开始加载
    setLoading(true)
    setCurrentResponse('')

    try {
      let accumulatedResponse = ''
      let searchResults: any[] = []

      await searchAPI.streamSearch(
        { query, useKnowledgeBase },
        (data: StreamData) => {
          if (data.type === 'content' && data.content) {
            accumulatedResponse += data.content
            appendToCurrentResponse(data.content)
          } else if (data.type === 'searchResults' && data.results) {
            searchResults = data.results
          }
        }
      )

      // 添加助手消息
      addMessage({
        role: 'assistant',
        content: accumulatedResponse,
        searchResults: searchResults.length > 0 ? searchResults : undefined,
      })
      
      setCurrentResponse('')
    } catch (error) {
      console.error('发送消息失败:', error)
      addMessage({
        role: 'assistant',
        content: '抱歉，发生了错误。请稍后重试。',
      })
    } finally {
      setLoading(false)
      setCurrentResponse('')
    }
  },
    }),
    {
      name: 'chat-store',
      partialize: (state) => ({
        messages: state.messages.slice(-20), // 只保存最近20条消息
        useKnowledgeBase: state.useKnowledgeBase,
      }),
    }
  )
)