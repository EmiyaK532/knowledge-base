import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Button, 
  Input, 
  Select, 
  DatePicker, 
  Slider, 
  Switch, 
  Form, 
  Space, 
  Collapse, 
  Tag,
  Tooltip,
  Card
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  ClearOutlined,
  InfoCircleOutlined,
  DownOutlined,
  UpOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Panel } = Collapse;

// 搜索表单验证架构
const searchSchema = z.object({
  query: z.string().min(1, '搜索关键词不能为空'),
  
  category: z.string().optional(),
  
  tags: z.array(z.string()).optional(),
  
  priority: z.enum(['low', 'medium', 'high']).optional(),
  
  dateRange: z.object({
    start: z.date().optional(),
    end: z.date().optional()
  }).optional(),
  
  isPublic: z.boolean().optional(),
  
  sortBy: z.enum(['relevance', 'date', 'title', 'priority']).default('relevance'),
  
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  
  limit: z.number().min(1).max(100).default(20),
  
  includeContent: z.boolean().default(true),
  
  exactMatch: z.boolean().default(false)
});

type SearchFormData = z.infer<typeof searchSchema>;

interface AdvancedSearchFormProps {
  onSearch: (data: SearchFormData) => void;
  onReset?: () => void;
  loading?: boolean;
  initialValues?: Partial<SearchFormData>;
}

export const AdvancedSearchForm: React.FC<AdvancedSearchFormProps> = ({
  onSearch,
  onReset,
  loading = false,
  initialValues = {}
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false);
  const [savedSearches, setSavedSearches] = React.useState<string[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: '',
      sortBy: 'relevance',
      sortOrder: 'desc',
      limit: 20,
      includeContent: true,
      exactMatch: false,
      ...initialValues
    },
    mode: 'onChange'
  });

  const currentValues = watch();

  // 分类选项
  const categoryOptions = [
    { value: 'tech', label: '技术知识', icon: '💻' },
    { value: 'business', label: '业务知识', icon: '📊' },
    { value: 'process', label: '流程文档', icon: '🔄' },
    { value: 'faq', label: '常见问题', icon: '❓' },
    { value: 'tutorial', label: '教程指南', icon: '📚' },
    { value: 'other', label: '其他', icon: '📁' }
  ];

  // 标签选项
  const tagOptions = [
    'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python',
    'AI', '机器学习', '前端', '后端', '数据库',
    '产品', '设计', '运营', '测试', '部署'
  ];

  // 排序选项
  const sortOptions = [
    { value: 'relevance', label: '相关性' },
    { value: 'date', label: '时间' },
    { value: 'title', label: '标题' },
    { value: 'priority', label: '优先级' }
  ];

  const handleFormSubmit = (data: SearchFormData) => {
    onSearch(data);
  };

  const handleReset = () => {
    reset();
    onReset?.();
  };

  const handleQuickSearch = (query: string) => {
    setValue('query', query);
    handleSubmit(handleFormSubmit)();
  };

  const saveCurrentSearch = () => {
    const searchName = currentValues.query || '未命名搜索';
    setSavedSearches(prev => [...prev, searchName]);
  };

  const quickSearchSuggestions = [
    'React Hook Form',
    'TypeScript 类型',
    'API 接口',
    '部署流程',
    '测试用例'
  ];

  return (
    <Card className="mb-6">
      <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)}>
        {/* 基础搜索 */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <Controller
              name="query"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  size="large"
                  placeholder="请输入搜索关键词..."
                  prefix={<SearchOutlined />}
                  status={errors.query ? 'error' : ''}
                  onPressEnter={() => handleSubmit(handleFormSubmit)()}
                />
              )}
            />
            {errors.query && (
              <p className="mt-1 text-sm text-red-600">{errors.query.message}</p>
            )}
          </div>

          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={loading}
            disabled={!isValid}
            icon={<SearchOutlined />}
          >
            搜索
          </Button>

          <Button
            size="large"
            onClick={handleReset}
            icon={<ClearOutlined />}
          >
            重置
          </Button>

          <Button
            size="large"
            type="dashed"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            icon={<FilterOutlined />}
          >
            高级搜索
            {isAdvancedOpen ? <UpOutlined /> : <DownOutlined />}
          </Button>
        </div>

        {/* 快速搜索建议 */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600">快速搜索：</span>
            {quickSearchSuggestions.map((suggestion, index) => (
              <Tag
                key={index}
                className="cursor-pointer hover:bg-blue-50"
                onClick={() => handleQuickSearch(suggestion)}
              >
                {suggestion}
              </Tag>
            ))}
          </div>
        </div>

        {/* 高级搜索面板 */}
        {isAdvancedOpen && (
          <Collapse defaultActiveKey={['filters']} ghost>
            <Panel
              header={
                <span className="flex items-center gap-2">
                  <FilterOutlined />
                  高级筛选选项
                </span>
              }
              key="filters"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 分类筛选 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    分类
                  </label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="选择分类"
                        allowClear
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
                </div>

                {/* 标签筛选 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    标签
                  </label>
                  <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        mode="multiple"
                        placeholder="选择标签"
                        allowClear
                        options={tagOptions.map(tag => ({
                          value: tag,
                          label: tag
                        }))}
                        maxTagCount="responsive"
                      />
                    )}
                  />
                </div>

                {/* 优先级筛选 */}
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
                        placeholder="选择优先级"
                        allowClear
                        options={[
                          { value: 'low', label: '低优先级' },
                          { value: 'medium', label: '中优先级' },
                          { value: 'high', label: '高优先级' }
                        ]}
                      />
                    )}
                  />
                </div>

                {/* 日期范围 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    创建日期
                  </label>
                  <Controller
                    name="dateRange"
                    control={control}
                    render={({ field }) => (
                      <RangePicker
                        {...field}
                        placeholder={['开始日期', '结束日期']}
                        className="w-full"
                        value={field.value ? [
                          field.value.start ? dayjs(field.value.start) : null,
                          field.value.end ? dayjs(field.value.end) : null
                        ] : null}
                        onChange={(dates) => {
                          field.onChange(dates ? {
                            start: dates[0]?.toDate(),
                            end: dates[1]?.toDate()
                          } : undefined);
                        }}
                      />
                    )}
                  />
                </div>

                {/* 排序方式 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    排序方式
                  </label>
                  <Space.Compact className="w-full">
                    <Controller
                      name="sortBy"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="排序字段"
                          options={sortOptions}
                          className="flex-1"
                        />
                      )}
                    />
                    <Controller
                      name="sortOrder"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          style={{ width: 80 }}
                          options={[
                            { value: 'desc', label: '降序' },
                            { value: 'asc', label: '升序' }
                          ]}
                        />
                      )}
                    />
                  </Space.Compact>
                </div>

                {/* 结果数量 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    结果数量: {currentValues.limit}
                    <Tooltip title="每页显示的搜索结果数量">
                      <InfoCircleOutlined className="ml-1 text-gray-400" />
                    </Tooltip>
                  </label>
                  <Controller
                    name="limit"
                    control={control}
                    render={({ field }) => (
                      <Slider
                        {...field}
                        min={1}
                        max={100}
                        marks={{
                          10: '10',
                          20: '20',
                          50: '50',
                          100: '100'
                        }}
                      />
                    )}
                  />
                </div>
              </div>

              {/* 搜索选项 */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Controller
                      name="includeContent"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <span className="text-sm">
                      搜索内容
                      <Tooltip title="是否在搜索结果中包含内容文本">
                        <InfoCircleOutlined className="ml-1 text-gray-400" />
                      </Tooltip>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Controller
                      name="exactMatch"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <span className="text-sm">
                      精确匹配
                      <Tooltip title="是否进行精确匹配搜索">
                        <InfoCircleOutlined className="ml-1 text-gray-400" />
                      </Tooltip>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Controller
                      name="isPublic"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="公开性"
                          allowClear
                          style={{ width: 120 }}
                          options={[
                            { value: true, label: '公开' },
                            { value: false, label: '私有' }
                          ]}
                        />
                      )}
                    />
                    <span className="text-sm">
                      公开性筛选
                    </span>
                  </div>
                </div>
              </div>

              {/* 保存搜索 */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <Button
                    type="dashed"
                    onClick={saveCurrentSearch}
                    disabled={!currentValues.query}
                  >
                    保存当前搜索
                  </Button>
                  
                  {savedSearches.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">已保存：</span>
                      {savedSearches.slice(-3).map((search, index) => (
                        <Tag
                          key={index}
                          className="cursor-pointer"
                          onClick={() => handleQuickSearch(search)}
                        >
                          {search}
                        </Tag>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Panel>
          </Collapse>
        )}
      </Form>
    </Card>
  );
};