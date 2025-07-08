import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select, Tag, message, Form, Divider } from 'antd';
import { PlusOutlined, BookOutlined, TagOutlined, FileTextOutlined } from '@ant-design/icons';

const { TextArea } = Input;

// 使用 Zod 定义表单验证架构
const knowledgeSchema = z.object({
  title: z.string()
    .min(1, '标题不能为空')
    .max(200, '标题不能超过200个字符'),
  
  content: z.string()
    .min(10, '内容至少需要10个字符')
    .max(10000, '内容不能超过10000个字符'),
  
  category: z.string()
    .min(1, '请选择分类'),
  
  tags: z.array(z.string())
    .min(1, '至少添加一个标签')
    .max(10, '标签数量不能超过10个'),
  
  description: z.string()
    .max(500, '描述不能超过500个字符')
    .optional()
    .or(z.literal('')),
  
  priority: z.enum(['low', 'medium', 'high']),
  
  isPublic: z.boolean()
});

type KnowledgeFormData = z.infer<typeof knowledgeSchema>;

interface KnowledgeFormProps {
  onSubmit: (data: KnowledgeFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  initialData?: Partial<KnowledgeFormData>;
}

export const KnowledgeForm: React.FC<KnowledgeFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  initialData = {}
}) => {
  const [customTags, setCustomTags] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
    setValue,
    watch
  } = useForm<KnowledgeFormData>({
    resolver: zodResolver(knowledgeSchema),
    defaultValues: {
      title: '',
      content: '',
      category: '',
      tags: [],
      description: '',
      priority: 'medium',
      isPublic: true,
      ...initialData
    },
    mode: 'onChange'
  });

  const currentTags = watch('tags');

  // 预定义的分类选项
  const categoryOptions = [
    { value: 'tech', label: '技术知识', icon: '💻' },
    { value: 'business', label: '业务知识', icon: '📊' },
    { value: 'process', label: '流程文档', icon: '🔄' },
    { value: 'faq', label: '常见问题', icon: '❓' },
    { value: 'tutorial', label: '教程指南', icon: '📚' },
    { value: 'other', label: '其他', icon: '📁' }
  ];

  // 预定义的标签选项
  const predefinedTags = [
    'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python',
    'AI', '机器学习', '前端', '后端', '数据库',
    '产品', '设计', '运营', '测试', '部署'
  ];

  const priorityOptions = [
    { value: 'low', label: '低优先级', color: '#87d068' },
    { value: 'medium', label: '中优先级', color: '#108ee9' },
    { value: 'high', label: '高优先级', color: '#f50' }
  ];

  const handleFormSubmit = async (data: KnowledgeFormData) => {
    try {
      await onSubmit(data);
      reset();
      setCustomTags([]);
      message.success('知识条目添加成功！');
    } catch (error) {
      message.error('添加失败，请稍后重试');
    }
  };

  const handleTagAdd = () => {
    if (inputValue && !currentTags.includes(inputValue) && !customTags.includes(inputValue)) {
      const newTags = [...currentTags, inputValue];
      setValue('tags', newTags, { shouldValidate: true });
      setCustomTags(prev => [...prev, inputValue]);
      setInputValue('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    const newTags = currentTags.filter(tag => tag !== tagToRemove);
    setValue('tags', newTags, { shouldValidate: true });
    setCustomTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handlePredefinedTagClick = (tag: string) => {
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag];
      setValue('tags', newTags, { shouldValidate: true });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BookOutlined className="text-blue-600" />
          添加知识条目
        </h2>
        <p className="text-gray-600 mt-2">为知识库添加新的内容，帮助团队更好地分享和管理知识。</p>
      </div>

      <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：基本信息 */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileTextOutlined className="mr-1" />
                标题 *
              </label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    placeholder="请输入知识条目标题"
                    status={errors.title ? 'error' : ''}
                  />
                )}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分类 *
              </label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="large"
                    placeholder="请选择分类"
                    status={errors.category ? 'error' : ''}
                    options={categoryOptions.map(option => ({
                      value: option.value,
                      label: (
                        <span>
                          <span className="mr-2">{option.icon}</span>
                          {option.label}
                        </span>
                      )
                    }))}
                  />
                )}
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                优先级
              </label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="large"
                    options={priorityOptions.map(option => ({
                      value: option.value,
                      label: (
                        <span>
                          <span 
                            className="inline-block w-2 h-2 rounded-full mr-2"
                            style={{ backgroundColor: option.color }}
                          />
                          {option.label}
                        </span>
                      )
                    }))}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                简短描述
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    rows={3}
                    placeholder="请输入简短描述（可选）"
                    status={errors.description ? 'error' : ''}
                  />
                )}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* 右侧：内容和标签 */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TagOutlined className="mr-1" />
                标签 *
              </label>
              
              {/* 当前标签显示 */}
              <div className="mb-3">
                {currentTags.map(tag => (
                  <Tag
                    key={tag}
                    closable
                    onClose={() => handleTagRemove(tag)}
                    className="mb-1"
                    color="blue"
                  >
                    {tag}
                  </Tag>
                ))}
              </div>

              {/* 添加新标签 */}
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="添加标签"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onPressEnter={handleTagAdd}
                  style={{ width: '200px' }}
                />
                <Button 
                  type="dashed" 
                  onClick={handleTagAdd}
                  icon={<PlusOutlined />}
                  disabled={!inputValue || currentTags.includes(inputValue)}
                >
                  添加
                </Button>
              </div>

              {/* 预定义标签 */}
              <div>
                <p className="text-sm text-gray-600 mb-2">常用标签：</p>
                <div className="flex flex-wrap gap-1">
                  {predefinedTags.map(tag => (
                    <Tag
                      key={tag}
                      onClick={() => handlePredefinedTagClick(tag)}
                      className={`cursor-pointer transition-colors ${
                        currentTags.includes(tag) 
                          ? 'bg-blue-100 border-blue-500 text-blue-700' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>

              {errors.tags && (
                <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                内容 *
              </label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    rows={8}
                    placeholder="请输入详细内容..."
                    status={errors.content ? 'error' : ''}
                    showCount
                    maxLength={10000}
                  />
                )}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>
          </div>
        </div>

        <Divider />

        {/* 操作按钮 */}
        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button onClick={onCancel} size="large">
              取消
            </Button>
          )}
          <Button 
            type="primary" 
            htmlType="submit"
            loading={loading}
            size="large"
            disabled={!isValid || !isDirty}
          >
            {loading ? '提交中...' : '添加知识条目'}
          </Button>
        </div>
      </Form>
    </div>
  );
};