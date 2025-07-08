import React from 'react';
import { Card, Alert, Button, Descriptions, Badge, Space, Spin } from 'antd';
import { 
  DatabaseOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  ReloadOutlined,
  LinkOutlined
} from '@ant-design/icons';

interface DatabaseInfo {
  database: string;
  status: string;
  url: string;
  collections: number;
  health: 'healthy' | 'unhealthy' | 'unknown';
}

interface ServerStatus {
  status: string;
  timestamp: string;
  database: DatabaseInfo;
}

export const DatabaseStatus: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [serverStatus, setServerStatus] = React.useState<ServerStatus | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const checkStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3000/health');
      if (!response.ok) {
        throw new Error(`服务器响应错误: ${response.status}`);
      }
      
      const data = await response.json();
      setServerStatus(data);
    } catch (err: any) {
      setError(err.message || '连接失败');
      setServerStatus(null);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    checkStatus();
    
    // 每30秒自动检查一次
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string, health: string) => {
    if (status === 'connected' && health === 'healthy') {
      return <Badge status="success" text="连接正常" />;
    } else if (status === 'disconnected' || health === 'unhealthy') {
      return <Badge status="error" text="连接失败" />;
    } else {
      return <Badge status="warning" text="状态未知" />;
    }
  };

  const getAlertType = () => {
    if (!serverStatus) return 'error';
    const { database } = serverStatus;
    if (database.status === 'connected' && database.health === 'healthy') {
      return 'success';
    } else {
      return 'error';
    }
  };

  const getAlertMessage = () => {
    if (error) {
      return {
        message: '后端服务连接失败',
        description: `错误信息: ${error}。请确保后端服务已启动 (http://localhost:3000)`
      };
    }
    
    if (!serverStatus) {
      return {
        message: '正在检查服务状态...',
        description: ''
      };
    }

    const { database } = serverStatus;
    if (database.status === 'connected' && database.health === 'healthy') {
      return {
        message: '所有服务运行正常',
        description: `后端服务和 ${database.database} 数据库连接正常，可以正常使用知识库功能。`
      };
    } else {
      return {
        message: 'Qdrant 数据库连接失败',
        description: '后端服务运行正常，但 Qdrant 数据库连接失败。知识库功能可能无法使用，请检查数据库连接。'
      };
    }
  };

  const alertInfo = getAlertMessage();

  return (
    <Card 
      title={
        <Space>
          <DatabaseOutlined />
          系统状态检查
        </Space>
      }
      extra={
        <Button 
          icon={<ReloadOutlined />}
          onClick={checkStatus}
          loading={loading}
          size="small"
        >
          刷新状态
        </Button>
      }
      className="mb-6"
    >
      <Space direction="vertical" size="middle" className="w-full">
        <Alert
          type={getAlertType()}
          message={alertInfo.message}
          description={alertInfo.description}
          showIcon
          icon={
            getAlertType() === 'success' ? 
              <CheckCircleOutlined /> : 
              <ExclamationCircleOutlined />
          }
        />

        {loading && (
          <div className="text-center">
            <Spin tip="正在检查系统状态..." />
          </div>
        )}

        {serverStatus && (
          <Descriptions 
            bordered 
            size="small"
            column={1}
            title="服务详情"
          >
            <Descriptions.Item 
              label={
                <Space>
                  <LinkOutlined />
                  后端服务
                </Space>
              }
            >
              <Space>
                <Badge status="success" text="运行中" />
                <span className="text-gray-500">
                  最后更新: {new Date(serverStatus.timestamp).toLocaleString()}
                </span>
              </Space>
            </Descriptions.Item>
            
            <Descriptions.Item 
              label={
                <Space>
                  <DatabaseOutlined />
                  数据库状态
                </Space>
              }
            >
              {getStatusBadge(serverStatus.database.status, serverStatus.database.health)}
            </Descriptions.Item>
            
            <Descriptions.Item label="数据库类型">
              {serverStatus.database.database}
            </Descriptions.Item>
            
            <Descriptions.Item label="连接地址">
              <code>{serverStatus.database.url}</code>
            </Descriptions.Item>
            
            <Descriptions.Item label="集合数量">
              {serverStatus.database.collections} 个
            </Descriptions.Item>
          </Descriptions>
        )}

        {error && (
          <Alert
            type="info"
            message="故障排查建议"
            description={
              <div>
                <p><strong>1. 检查后端服务:</strong></p>
                <ul className="ml-4 mb-2">
                  <li>确保后端服务已启动: <code>cd backend && pnpm dev</code></li>
                  <li>检查端口 3000 是否被占用</li>
                </ul>
                
                <p><strong>2. 检查 Qdrant 数据库:</strong></p>
                <ul className="ml-4 mb-2">
                  <li>启动 Qdrant: <code>./scripts/start-qdrant.sh</code></li>
                  <li>检查 Docker 容器: <code>docker ps | grep qdrant</code></li>
                  <li>访问 Qdrant 控制台: <a href="http://localhost:6333/dashboard" target="_blank" rel="noopener noreferrer">http://localhost:6333/dashboard</a></li>
                </ul>
              </div>
            }
          />
        )}
      </Space>
    </Card>
  );
};