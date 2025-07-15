// Qdrant 查询结果类型
export interface QdrantResult {
  id: string | number;
  score: number;
  payload?: {
    text?: string;
    content?: string;
    metadata?: any;
    [key: string]: any;
  };
}

// Rerank 请求数据类型
export interface RData {
  model: string;
  input: {
    query: string;
    documents: string[];
  };
  parameters: {
    return_documents: boolean;
    top_n: number;
  };
}

// Rerank 输出类型
export interface RerankOutput {
  output: {
    results: RerankedResult[];
  };
}

// Rerank 结果类型
export interface RerankedResult {
  index: number;
  relevance_score: number;
  document: {
    text: string;
  };
}
