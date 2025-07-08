import { message } from 'antd';

export interface ApiError {
  error?: string;
  message?: string;
  code?: number;
  details?: any;
}

export class ErrorHandler {
  // 处理 API 错误响应
  static handleApiError(error: any, defaultMessage: string = '操作失败'): void {
    let errorMessage = defaultMessage;
    
    if (error?.response?.data) {
      const apiError: ApiError = error.response.data;
      
      // 优先使用服务器返回的错误信息
      if (apiError.error) {
        errorMessage = apiError.error;
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }
      
      // 根据状态码显示特定错误
      const statusCode = error.response.status;
      switch (statusCode) {
        case 400:
          errorMessage = `请求参数错误: ${errorMessage}`;
          break;
        case 401:
          errorMessage = '未授权，请重新登录';
          break;
        case 403:
          errorMessage = '权限不足，无法执行此操作';
          break;
        case 404:
          errorMessage = '请求的资源不存在';
          break;
        case 429:
          errorMessage = '请求过于频繁，请稍后重试';
          break;
        case 500:
          errorMessage = '服务器内部错误，请稍后重试';
          break;
        case 503:
          errorMessage = '服务暂时不可用，请稍后重试';
          break;
        default:
          if (statusCode >= 500) {
            errorMessage = `服务器错误 (${statusCode}): ${errorMessage}`;
          } else if (statusCode >= 400) {
            errorMessage = `客户端错误 (${statusCode}): ${errorMessage}`;
          }
      }
    } else if (error?.message) {
      // 处理网络错误或其他错误
      if (error.message.includes('Network Error')) {
        errorMessage = '网络连接失败，请检查您的网络连接';
      } else if (error.message.includes('timeout')) {
        errorMessage = '请求超时，请稍后重试';
      } else {
        errorMessage = error.message;
      }
    }
    
    message.error(errorMessage);
    
    // 在开发环境下输出详细错误信息
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error Details:', error);
    }
  }
  
  // 处理表单验证错误
  static handleFormError(error: any, fieldName?: string): void {
    let errorMessage = '表单验证失败';
    
    if (fieldName) {
      errorMessage = `${fieldName} 验证失败`;
    }
    
    if (error?.message) {
      errorMessage = error.message;
    }
    
    message.error(errorMessage);
  }
  
  // 显示成功消息
  static showSuccess(message: string = '操作成功'): void {
    message.success(message);
  }
  
  // 显示警告消息
  static showWarning(message: string): void {
    message.warning(message);
  }
  
  // 显示信息消息
  static showInfo(message: string): void {
    message.info(message);
  }
  
  // 处理特定业务错误
  static handleBusinessError(errorCode: string, defaultMessage: string = '业务处理失败'): void {
    const businessErrors: Record<string, string> = {
      'KNOWLEDGE_EXISTS': '知识条目已存在',
      'KNOWLEDGE_NOT_FOUND': '知识条目不存在',
      'INVALID_CATEGORY': '无效的分类',
      'TAGS_LIMIT_EXCEEDED': '标签数量超出限制',
      'CONTENT_TOO_LONG': '内容长度超出限制',
      'SEARCH_FAILED': '搜索失败，请稍后重试',
      'UPLOAD_FAILED': '文件上传失败',
      'PERMISSION_DENIED': '权限不足',
      'USER_NOT_FOUND': '用户不存在',
      'SETTINGS_SAVE_FAILED': '设置保存失败'
    };
    
    const errorMessage = businessErrors[errorCode] || defaultMessage;
    message.error(errorMessage);
  }
}

// 导出便捷的错误处理函数
export const handleApiError = ErrorHandler.handleApiError;
export const handleFormError = ErrorHandler.handleFormError;
export const showSuccess = ErrorHandler.showSuccess;
export const showWarning = ErrorHandler.showWarning;
export const showInfo = ErrorHandler.showInfo;
export const handleBusinessError = ErrorHandler.handleBusinessError;