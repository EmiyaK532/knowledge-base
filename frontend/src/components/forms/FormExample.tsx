import React from 'react';
import { Button, Card, Space } from 'antd';
import { useErrorHandler } from '@/hooks/useErrorHandler';

// 这是一个示例组件，展示如何使用统一的错误处理
export const FormExample: React.FC = () => {
  const { 
    handleError, 
    handleBusiness, 
    success, 
    warning, 
    info,
    withErrorHandling,
    safeExecute
  } = useErrorHandler();

  // 模拟 API 调用失败
  const simulateApiError = async () => {
    throw new Error('模拟的API错误');
  };

  // 模拟业务错误
  const simulateBusinessError = () => {
    handleBusiness('KNOWLEDGE_EXISTS');
  };

  // 使用 withErrorHandling 包装的异步操作
  const handleApiCall = withErrorHandling(simulateApiError, '操作失败了');

  // 使用 safeExecute 的异步操作
  const handleSafeApiCall = safeExecute(simulateApiError, '安全操作失败');

  return (
    <Card title="错误处理示例" className="max-w-2xl mx-auto mt-8">
      <Space direction="vertical" size="middle" className="w-full">
        <div>
          <h3>消息类型示例：</h3>
          <Space>
            <Button type="primary" onClick={() => success('操作成功！')}>
              成功消息
            </Button>
            <Button onClick={() => warning('这是一个警告消息')}>
              警告消息
            </Button>
            <Button onClick={() => info('这是一个信息消息')}>
              信息消息
            </Button>
          </Space>
        </div>

        <div>
          <h3>错误处理示例：</h3>
          <Space>
            <Button 
              danger 
              onClick={() => handleError(new Error('这是一个通用错误'), '自定义错误消息')}
            >
              通用错误
            </Button>
            <Button 
              danger 
              onClick={simulateBusinessError}
            >
              业务错误
            </Button>
            <Button 
              danger 
              onClick={handleApiCall}
            >
              API错误 (会重新抛出)
            </Button>
            <Button 
              danger 
              onClick={handleSafeApiCall}
            >
              安全API调用 (不会抛出)
            </Button>
          </Space>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h4>使用说明：</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>success/warning/info:</strong> 显示不同类型的提示消息</li>
            <li><strong>handleError:</strong> 处理通用错误，支持自定义消息</li>
            <li><strong>handleBusiness:</strong> 处理预定义的业务错误代码</li>
            <li><strong>withErrorHandling:</strong> 包装异步函数，自动处理错误但会重新抛出</li>
            <li><strong>safeExecute:</strong> 包装异步函数，处理错误且不会重新抛出</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded">
          <h4>表单中的使用建议：</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>API 层统一处理错误消息显示</li>
            <li>表单组件专注于业务逻辑，不重复处理错误提示</li>
            <li>使用业务错误代码提供更精确的错误信息</li>
            <li>开发环境下会在控制台输出详细错误信息</li>
          </ul>
        </div>
      </Space>
    </Card>
  );
};