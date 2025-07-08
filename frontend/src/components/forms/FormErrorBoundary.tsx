import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert, Button, Result } from 'antd';
import { ExclamationCircleOutlined, ReloadOutlined, BugOutlined } from '@ant-design/icons';

interface FormErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const FormErrorFallback: React.FC<FormErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Result
        status="error"
        icon={<BugOutlined className="text-red-500" />}
        title="表单加载失败"
        subTitle="抱歉，表单组件遇到了未预期的错误。请尝试刷新页面或联系技术支持。"
        extra={[
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            onClick={resetErrorBoundary}
            key="retry"
          >
            重试
          </Button>,
          <Button 
            key="refresh"
            onClick={() => window.location.reload()}
          >
            刷新页面
          </Button>
        ]}
      >
        {isDevelopment && (
          <Alert
            message="开发环境错误详情"
            description={
              <div className="text-left">
                <p><strong>错误信息：</strong>{error.message}</p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600">查看错误堆栈</summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {error.stack}
                  </pre>
                </details>
              </div>
            }
            type="warning"
            showIcon
            className="mt-4 text-left"
          />
        )}
      </Result>
    </div>
  );
};

interface FormErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export const FormErrorBoundary: React.FC<FormErrorBoundaryProps> = ({
  children,
  onError
}) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Form Error Boundary caught an error:', error, errorInfo);
    
    // 发送错误报告到监控服务
    if (onError) {
      onError(error, errorInfo);
    }
    
    // 可以集成到错误监控服务，如 Sentry
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, {
    //     contexts: {
    //       react: {
    //         componentStack: errorInfo.componentStack,
    //       },
    //     },
    //   });
    // }
  };

  return (
    <ErrorBoundary
      FallbackComponent={FormErrorFallback}
      onError={handleError}
      onReset={() => {
        // 清理状态或执行重置逻辑
        console.log('Form Error Boundary reset');
      }}
    >
      {children}
    </ErrorBoundary>
  );
};