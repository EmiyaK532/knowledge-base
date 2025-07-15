import { AxiosResponse } from "axios"
import axios from "../request/index"
import { RData, RerankOutput } from "../types/index"

// 文本排序模型
export function rerank (data: RData): Promise<AxiosResponse<RerankOutput, any>> {
  return axios.post(process.env.DASHSCOPE_API_RERANK_PATH!, data)
}
