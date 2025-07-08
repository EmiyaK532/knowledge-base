import request from '@/lib/request'

export interface SearchParams {
  query: string
  useKnowledgeBase?: boolean
}

export interface SearchResult {
  id: string
  content: string
  score: number
  metadata?: any
}

export interface StreamData {
  type: 'content' | 'searchResults' | 'error'
  content?: string
  results?: SearchResult[]
  error?: string
}

export const searchAPI = {
  // 流式搜索
  async streamSearch(params: SearchParams, onData: (data: StreamData) => void) {
    return request.stream('/api/search', params, onData)
  },
}