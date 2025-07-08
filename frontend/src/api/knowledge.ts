import request from '@/lib/request'

export interface Knowledge {
  id: string
  content: string
  metadata?: any
  timestamp?: string
}

export interface KnowledgeItem {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  description?: string
  priority: 'low' | 'medium' | 'high'
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface AddKnowledgeParams {
  content: string
  metadata?: any
}

export interface AddKnowledgeRequest {
  title: string
  content: string
  category: string
  tags: string[]
  description?: string
  priority: 'low' | 'medium' | 'high'
  isPublic: boolean
}

export interface ListKnowledgeParams {
  limit?: number
  offset?: number
}

export interface KnowledgeListResponse {
  success: boolean
  data: KnowledgeItem[]
  total: number
}

export const knowledgeAPI = {
  // 添加知识
  async add(params: AddKnowledgeParams) {
    return request.post<{ success: boolean; id: string }>('/api/knowledge/add', params)
  },

  // 添加知识条目（增强版）
  async addKnowledge(data: AddKnowledgeRequest): Promise<{ success: boolean; id: string }> {
    try {
      const metadata = {
        title: data.title,
        category: data.category,
        tags: data.tags,
        description: data.description,
        priority: data.priority,
        isPublic: data.isPublic,
        createdAt: new Date().toISOString()
      }

      const response = await request.post('/api/knowledge/add', {
        content: data.content,
        metadata
      })
      
      return response
    } catch (error: any) {
      const { handleApiError, handleBusinessError } = await import('@/utils/errorHandler')
      
      // 处理特定的业务错误
      if (error?.response?.data?.error) {
        const errorCode = error.response.data.error
        if (errorCode.includes('exists')) {
          handleBusinessError('KNOWLEDGE_EXISTS')
        } else if (errorCode.includes('invalid category')) {
          handleBusinessError('INVALID_CATEGORY')
        } else if (errorCode.includes('tags limit')) {
          handleBusinessError('TAGS_LIMIT_EXCEEDED')
        } else if (errorCode.includes('content too long')) {
          handleBusinessError('CONTENT_TOO_LONG')
        } else {
          handleApiError(error, '添加知识条目失败')
        }
      } else {
        handleApiError(error, '添加知识条目失败')
      }
      
      throw error
    }
  },

  // 删除知识
  async delete(id: string) {
    return request.delete<{ success: boolean }>(`/api/knowledge/${id}`)
  },

  // 获取知识列表
  async list(params?: ListKnowledgeParams) {
    return request.get<{ success: boolean; data: Knowledge[] }>('/api/knowledge/list', {
      params,
    })
  },

  // 获取知识列表（增强版）
  async getKnowledgeList(params: {
    limit?: number
    offset?: number
    category?: string
    tags?: string[]
  } = {}): Promise<KnowledgeListResponse> {
    const { limit = 20, offset = 0, category, tags } = params
    
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    })

    if (category) {
      queryParams.append('category', category)
    }

    if (tags && tags.length > 0) {
      tags.forEach(tag => queryParams.append('tags', tag))
    }

    return request.get(`/api/knowledge/list?${queryParams.toString()}`)
  },

  // 搜索知识条目
  async searchKnowledge(params: {
    query: string
    category?: string
    tags?: string[]
    limit?: number
    offset?: number
  }): Promise<KnowledgeListResponse> {
    const { query, category, tags, limit = 20, offset = 0 } = params
    
    const queryParams = new URLSearchParams({
      query,
      limit: limit.toString(),
      offset: offset.toString()
    })

    if (category) {
      queryParams.append('category', category)
    }

    if (tags && tags.length > 0) {
      tags.forEach(tag => queryParams.append('tags', tag))
    }

    return request.get(`/api/knowledge/search?${queryParams.toString()}`)
  }
}