import request from '@/lib/request'

export interface Knowledge {
  id: string
  content: string
  metadata?: any
  timestamp?: string
}

export interface AddKnowledgeParams {
  content: string
  metadata?: any
}

export interface ListKnowledgeParams {
  limit?: number
  offset?: number
}

export const knowledgeAPI = {
  // 添加知识
  async add(params: AddKnowledgeParams) {
    return request.post<{ success: boolean; id: string }>('/api/knowledge/add', params)
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
}