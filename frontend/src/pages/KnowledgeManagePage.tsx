import React from 'react';
import { Modal, Button, Card, List, Tag, Space, Popconfirm } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  SearchOutlined 
} from '@ant-design/icons';
import { KnowledgeForm } from '@/components/forms/KnowledgeForm';
import { AdvancedSearchForm } from '@/components/forms/AdvancedSearchForm';
import { FormErrorBoundary } from '@/components/forms/FormErrorBoundary';
import { knowledgeAPI, type AddKnowledgeRequest, type KnowledgeItem } from '@/api/knowledge';

export const KnowledgeManagePage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [knowledgeList, setKnowledgeList] = React.useState<KnowledgeItem[]>([]);
  const [searchLoading, setSearchLoading] = React.useState(false);

  // 加载知识列表
  const loadKnowledgeList = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await knowledgeAPI.getKnowledgeList();
      if (response.success) {
        setKnowledgeList(response.data);
      }
    } catch (error) {
      const { handleApiError } = await import('@/utils/errorHandler');
      handleApiError(error, '加载知识列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadKnowledgeList();
  }, [loadKnowledgeList]);

  // 处理添加知识
  const handleAddKnowledge = async (data: AddKnowledgeRequest) => {
    try {
      const response = await knowledgeAPI.addKnowledge(data);
      if (response.success) {
        const { showSuccess } = await import('@/utils/errorHandler');
        showSuccess('知识条目添加成功！');
        setIsAddModalOpen(false);
        loadKnowledgeList(); // 重新加载列表
      }
    } catch (error) {
      // 错误消息已在 API 层处理
      throw error;
    }
  };

  // 处理搜索
  const handleSearch = async (searchData: any) => {
    try {
      setSearchLoading(true);
      const response = await knowledgeAPI.searchKnowledge({
        query: searchData.query,
        category: searchData.category,
        tags: searchData.tags,
        limit: searchData.limit
      });
      if (response.success) {
        setKnowledgeList(response.data);
        const { showSuccess } = await import('@/utils/errorHandler');
        showSuccess(`找到 ${response.data.length} 条相关知识`);
      }
    } catch (error) {
      const { handleBusinessError } = await import('@/utils/errorHandler');
      handleBusinessError('SEARCH_FAILED');
    } finally {
      setSearchLoading(false);
    }
  };

  // 处理删除知识
  const handleDeleteKnowledge = async (id: string) => {
    try {
      const response = await knowledgeAPI.delete(id);
      if (response.success) {
        const { showSuccess } = await import('@/utils/errorHandler');
        showSuccess('删除成功');
        loadKnowledgeList();
      }
    } catch (error) {
      const { handleApiError } = await import('@/utils/errorHandler');
      handleApiError(error, '删除失败，请稍后重试');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'blue';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '高优先级';
      case 'medium': return '中优先级';
      case 'low': return '低优先级';
      default: return '未知';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">知识库管理</h1>
            <p className="text-gray-600 mt-1">管理和维护您的知识库内容</p>
          </div>
          
          <Space>
            <Button
              icon={<SearchOutlined />}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              高级搜索
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setIsAddModalOpen(true)}
            >
              添加知识条目
            </Button>
          </Space>
        </div>
      </div>

      {/* 搜索表单 */}
      {isSearchOpen && (
        <FormErrorBoundary>
          <AdvancedSearchForm
            onSearch={handleSearch}
            onReset={loadKnowledgeList}
            loading={searchLoading}
          />
        </FormErrorBoundary>
      )}

      {/* 知识列表 */}
      <Card>
        <List
          loading={loading}
          dataSource={knowledgeList}
          pagination={{
            total: knowledgeList.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <Button 
                  key="view" 
                  type="text" 
                  icon={<EyeOutlined />}
                  onClick={() => {
                    Modal.info({
                      title: item.title,
                      content: (
                        <div className="max-h-96 overflow-y-auto">
                          <p className="mb-2"><strong>分类：</strong>{item.category}</p>
                          <p className="mb-2"><strong>标签：</strong>
                            {item.tags.map(tag => (
                              <Tag key={tag} className="ml-1">{tag}</Tag>
                            ))}
                          </p>
                          {item.description && (
                            <p className="mb-2"><strong>描述：</strong>{item.description}</p>
                          )}
                          <p><strong>内容：</strong></p>
                          <div className="mt-2 p-3 bg-gray-50 rounded whitespace-pre-wrap">
                            {item.content}
                          </div>
                        </div>
                      ),
                      width: 800
                    });
                  }}
                >
                  查看
                </Button>,
                <Button 
                  key="edit" 
                  type="text" 
                  icon={<EditOutlined />}
                  onClick={() => {
                    // TODO: 实现编辑功能
                    message.info('编辑功能开发中...');
                  }}
                >
                  编辑
                </Button>,
                <Popconfirm
                  key="delete"
                  title="确定要删除这个知识条目吗？"
                  description="删除后无法恢复"
                  onConfirm={() => handleDeleteKnowledge(item.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />}
                  >
                    删除
                  </Button>
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                title={
                  <div className="flex items-center gap-2">
                    <span>{item.title}</span>
                    <Tag color={getPriorityColor(item.priority)}>
                      {getPriorityText(item.priority)}
                    </Tag>
                    {!item.isPublic && <Tag color="orange">私有</Tag>}
                  </div>
                }
                description={
                  <div className="space-y-2">
                    {item.description && (
                      <p className="text-gray-600">{item.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1">
                      <Tag color="blue">{item.category}</Tag>
                      {item.tags.slice(0, 3).map(tag => (
                        <Tag key={tag} color="geekblue">{tag}</Tag>
                      ))}
                      {item.tags.length > 3 && (
                        <Tag>+{item.tags.length - 3}</Tag>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      创建于 {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* 添加知识条目弹窗 */}
      <Modal
        title="添加知识条目"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        width={1000}
        destroyOnClose
      >
        <FormErrorBoundary>
          <KnowledgeForm
            onSubmit={handleAddKnowledge}
            onCancel={() => setIsAddModalOpen(false)}
            loading={loading}
          />
        </FormErrorBoundary>
      </Modal>
    </div>
  );
};