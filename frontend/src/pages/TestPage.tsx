import React from 'react';
import { Card, Space, Button, Divider } from 'antd';
import { FormExample } from '@/components/forms/FormExample';
import { DatabaseStatus } from '@/components/DatabaseStatus';
import { useNavigate } from 'react-router-dom';

export const TestPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* 系统状态检查 */}
      <DatabaseStatus />
      
      <Card title="🎉 表单功能测试页面" className="mb-6">
        <Space direction="vertical" size="large" className="w-full">
          <div>
            <h3>✅ 成功集成的功能：</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>React Hook Form + Zod 验证</strong> - 强类型表单验证系统</li>
              <li><strong>知识条目添加表单</strong> - 完整的知识管理界面</li>
              <li><strong>高级搜索表单</strong> - 多条件筛选和搜索功能</li>
              <li><strong>用户设置表单</strong> - 个性化配置管理</li>
              <li><strong>统一错误处理</strong> - 使用 Ant Design Message 组件</li>
              <li><strong>React Router</strong> - 多页面导航系统</li>
              <li><strong>响应式布局</strong> - 支持桌面端和移动端</li>
            </ul>
          </div>

          <Divider />

          <div>
            <h3>🧭 页面导航测试：</h3>
            <Space wrap>
              <Button 
                type="primary" 
                onClick={() => navigate('/')}
              >
                智能对话 (/)
              </Button>
              <Button 
                onClick={() => navigate('/chat')}
              >
                聊天界面 (/chat)
              </Button>
              <Button 
                onClick={() => navigate('/knowledge')}
              >
                知识管理 (/knowledge)
              </Button>
              <Button 
                onClick={() => navigate('/settings')}
              >
                用户设置 (/settings)
              </Button>
            </Space>
          </div>

          <Divider />

          <div>
            <h3>🔧 技术栈信息：</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-50 p-4 rounded">
                <h4 className="font-semibold mb-2">前端框架</h4>
                <ul className="space-y-1">
                  <li>• React 19.1.0</li>
                  <li>• TypeScript</li>
                  <li>• Vite</li>
                  <li>• Tailwind CSS</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <h4 className="font-semibold mb-2">表单处理</h4>
                <ul className="space-y-1">
                  <li>• React Hook Form 7.60.0</li>
                  <li>• Zod 3.25.76</li>
                  <li>• @hookform/resolvers 5.1.1</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <h4 className="font-semibold mb-2">UI 组件</h4>
                <ul className="space-y-1">
                  <li>• Ant Design 5.26.4</li>
                  <li>• Framer Motion 12.23.0</li>
                  <li>• Lucide React 0.525.0</li>
                </ul>
              </div>
              <div className="bg-orange-50 p-4 rounded">
                <h4 className="font-semibold mb-2">路由 & 状态</h4>
                <ul className="space-y-1">
                  <li>• React Router DOM 7.6.3</li>
                  <li>• Zustand 5.0.6</li>
                  <li>• Axios 1.10.0</li>
                </ul>
              </div>
            </div>
          </div>

          <Divider />

          <div>
            <h3>📝 使用说明：</h3>
            <div className="bg-gray-50 p-4 rounded text-sm">
              <ol className="list-decimal list-inside space-y-2">
                <li>点击左侧导航菜单可以切换不同页面</li>
                <li>在 "知识管理" 页面可以测试添加知识条目和高级搜索功能</li>
                <li>在 "用户设置" 页面可以测试个性化配置表单</li>
                <li>所有表单都集成了完整的验证和错误处理</li>
                <li>错误信息会通过 Ant Design 的 message 组件显示</li>
              </ol>
            </div>
          </div>
        </Space>
      </Card>

      {/* 错误处理演示 */}
      <FormExample />
    </div>
  );
};