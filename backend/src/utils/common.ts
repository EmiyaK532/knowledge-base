import { QdrantResult, RerankedResult } from "../types/index"

// qdrant查询的向量转换成文本格式
export function vectorFormat(documents: QdrantResult[]): string[] {
  const arr = documents.map(document => {
    if (document.payload && document.payload.text) {
      return document.payload.text as string
    }
    return ""
  })
  return arr
}

// reranked查询结果进行转换
export function rerankedFormat(documents: RerankedResult[]): string[] {
  const arr = documents.map(document => {
    if (document.document && document.document.text) {
      return document.document.text as string
    }
    return ""
  })
  return arr
}
