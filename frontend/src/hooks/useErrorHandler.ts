import { useCallback } from 'react';
import { 
  handleApiError, 
  handleFormError, 
  handleBusinessError,
  showSuccess,
  showWarning,
  showInfo 
} from '@/utils/errorHandler';

export const useErrorHandler = () => {
  const handleError = useCallback((error: any, defaultMessage?: string) => {
    handleApiError(error, defaultMessage);
  }, []);

  const handleFormValidationError = useCallback((error: any, fieldName?: string) => {
    handleFormError(error, fieldName);
  }, []);

  const handleBusiness = useCallback((errorCode: string, defaultMessage?: string) => {
    handleBusinessError(errorCode, defaultMessage);
  }, []);

  const success = useCallback((message: string) => {
    showSuccess(message);
  }, []);

  const warning = useCallback((message: string) => {
    showWarning(message);
  }, []);

  const info = useCallback((message: string) => {
    showInfo(message);
  }, []);

  // 包装异步操作，自动处理错误
  const withErrorHandling = useCallback(
    <T extends any[], R>(
      asyncFn: (...args: T) => Promise<R>,
      errorMessage?: string
    ) => {
      return async (...args: T): Promise<R | undefined> => {
        try {
          return await asyncFn(...args);
        } catch (error) {
          handleError(error, errorMessage);
          throw error; // 重新抛出，让调用方决定如何处理
        }
      };
    },
    [handleError]
  );

  // 安全执行异步操作，吞掉错误
  const safeExecute = useCallback(
    <T extends any[], R>(
      asyncFn: (...args: T) => Promise<R>,
      errorMessage?: string
    ) => {
      return async (...args: T): Promise<R | undefined> => {
        try {
          return await asyncFn(...args);
        } catch (error) {
          handleError(error, errorMessage);
          return undefined;
        }
      };
    },
    [handleError]
  );

  return {
    handleError,
    handleFormValidationError,
    handleBusiness,
    success,
    warning,
    info,
    withErrorHandling,
    safeExecute
  };
};