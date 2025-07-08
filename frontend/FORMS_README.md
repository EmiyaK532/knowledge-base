# 智能知识库 - 表单功能文档

## 🎯 功能概述

基于 React Hook Form + Zod + Ant Design 的完整表单解决方案，为智能知识库提供了强大的表单功能和错误处理机制。

## 📁 文件结构

```
src/
├── components/forms/           # 表单组件
│   ├── KnowledgeForm.tsx      # 知识条目添加表单
│   ├── AdvancedSearchForm.tsx # 高级搜索表单
│   ├── UserSettingsForm.tsx  # 用户设置表单
│   ├── FormErrorBoundary.tsx # 表单错误边界
│   ├── FormValidation.tsx    # 验证组件
│   ├── FormExample.tsx       # 使用示例
│   └── index.ts              # 统一导出
├── utils/
│   └── errorHandler.ts       # 错误处理工具
├── hooks/
│   └── useErrorHandler.ts    # 错误处理Hook
├── pages/
│   ├── KnowledgeManagePage.tsx # 知识管理页面
│   ├── UserSettingsPage.tsx   # 用户设置页面
│   └── TestPage.tsx           # 表单功能测试页面
└── router/
    └── index.tsx             # 路由配置
```

## 🚀 快速开始

### 1. 启动开发服务器

```bash
pnpm dev
```

### 2. 访问表单功能

访问 `http://localhost:5173/test` 查看表单功能演示和使用说明。

### 3. 页面导航

- `/` - 智能对话（原聊天界面）
- `/knowledge` - 知识管理（表单功能）
- `/settings` - 用户设置（个性化配置）
- `/test` - 表单测试页面

## 🔧 核心功能

### 1. 知识条目添加表单

**位置**: `/knowledge`

**功能特性**:
- ✅ 标题、内容、分类、标签、描述等字段
- ✅ 预定义标签选择和自定义标签添加
- ✅ 优先级设置（高/中/低）
- ✅ 公开性控制
- ✅ 实时表单验证
- ✅ 字符数限制和提示

**使用示例**:
```tsx
import { KnowledgeForm } from '@/components/forms';

<KnowledgeForm
  onSubmit={handleAddKnowledge}
  onCancel={() => setModalOpen(false)}
  loading={loading}
/>
```

### 2. 高级搜索表单

**位置**: `/knowledge` (点击高级搜索按钮)

**功能特性**:
- ✅ 基础关键词搜索
- ✅ 分类筛选
- ✅ 标签多选
- ✅ 优先级筛选
- ✅ 日期范围筛选
- ✅ 排序设置
- ✅ 搜索历史保存
- ✅ 快速搜索建议

### 3. 用户设置表单

**位置**: `/settings`

**功能特性**:
- ✅ 个人信息配置
- ✅ AI 模型参数设置
- ✅ 界面主题定制
- ✅ 通知设置
- ✅ 隐私配置
- ✅ 快捷键定制
- ✅ 实时预览

## 🛡️ 错误处理系统

### 统一错误处理工具

```tsx
import { useErrorHandler } from '@/hooks/useErrorHandler';

const { handleError, success, withErrorHandling } = useErrorHandler();

// 显示成功消息
success('操作成功！');

// 处理API错误
handleError(error, '自定义错误消息');

// 包装异步操作
const safeApiCall = withErrorHandling(apiFunction, '操作失败');
```

### 错误类型

1. **API错误** - 自动识别HTTP状态码并显示相应消息
2. **业务错误** - 预定义的业务错误代码处理
3. **表单验证错误** - Zod验证错误的友好显示
4. **网络错误** - 连接失败、超时等问题

### 预定义业务错误代码

```tsx
// 错误代码对应的消息
const businessErrors = {
  'KNOWLEDGE_EXISTS': '知识条目已存在',
  'INVALID_CATEGORY': '无效的分类',
  'TAGS_LIMIT_EXCEEDED': '标签数量超出限制',
  'SEARCH_FAILED': '搜索失败，请稍后重试',
  // ... 更多错误代码
};
```

## 🎨 表单验证

### Zod 验证架构示例

```tsx
const knowledgeSchema = z.object({
  title: z.string()
    .min(1, '标题不能为空')
    .max(200, '标题不能超过200个字符'),
  
  content: z.string()
    .min(10, '内容至少需要10个字符')
    .max(10000, '内容不能超过10000个字符'),
  
  tags: z.array(z.string())
    .min(1, '至少添加一个标签')
    .max(10, '标签数量不能超过10个'),
  
  // ... 更多字段
});
```

### React Hook Form 集成

```tsx
const {
  control,
  handleSubmit,
  formState: { errors, isValid, isDirty },
} = useForm<FormData>({
  resolver: zodResolver(schema),
  mode: 'onChange'
});
```

## 📱 响应式设计

所有表单组件都支持响应式设计：

- **桌面端**: 完整的多列布局
- **平板端**: 适配的两列布局  
- **移动端**: 单列堆叠布局
- **侧边栏**: 可折叠的导航菜单

## 🔌 API 集成

### 知识库 API

```tsx
// 添加知识条目
await knowledgeAPI.addKnowledge(data);

// 搜索知识
await knowledgeAPI.searchKnowledge({
  query: '搜索关键词',
  category: '分类',
  tags: ['标签1', '标签2']
});

// 获取知识列表
await knowledgeAPI.getKnowledgeList();
```

### 错误处理集成

API层自动处理错误并显示用户友好的消息，表单组件无需重复处理错误提示。

## 🎯 最佳实践

### 1. 表单组件使用

```tsx
// ✅ 推荐：使用错误边界包装
<FormErrorBoundary>
  <KnowledgeForm onSubmit={handleSubmit} />
</FormErrorBoundary>

// ✅ 推荐：使用统一的错误处理
const { withErrorHandling } = useErrorHandler();
const handleSubmit = withErrorHandling(apiCall, '提交失败');
```

### 2. 错误处理

```tsx
// ✅ 推荐：让API层处理错误显示
try {
  await knowledgeAPI.addKnowledge(data);
  // 成功逻辑
} catch (error) {
  // 错误已在API层处理，无需重复显示
  throw error;
}

// ❌ 不推荐：重复的错误处理
try {
  await knowledgeAPI.addKnowledge(data);
} catch (error) {
  message.error('添加失败'); // 重复显示错误
}
```

### 3. 表单验证

```tsx
// ✅ 推荐：详细的验证规则
const schema = z.object({
  email: z.string()
    .email('邮箱格式不正确')
    .optional()
    .or(z.literal('')), // 允许空值
});

// ✅ 推荐：实时验证
const form = useForm({
  mode: 'onChange', // 实时验证
  resolver: zodResolver(schema)
});
```

## 🚀 扩展指南

### 添加新的表单组件

1. 创建组件文件 `src/components/forms/NewForm.tsx`
2. 定义 Zod 验证架构
3. 使用 React Hook Form + Controller 
4. 集成错误处理
5. 添加到 `src/components/forms/index.ts`

### 添加新的错误类型

1. 在 `src/utils/errorHandler.ts` 中添加业务错误代码
2. 在 API 层使用 `handleBusinessError(errorCode)`
3. 测试错误显示效果

## 📞 技术支持

如果您在使用过程中遇到问题，可以：

1. 查看 `/test` 页面的使用示例
2. 检查浏览器控制台的错误信息
3. 参考本文档的最佳实践部分

---

**注意**: 这是一个基于学习和实验目的的项目，如需在生产环境使用，请进行充分的测试和优化。