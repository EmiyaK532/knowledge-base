import React from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Button,
  Input,
  Select,
  Switch,
  Slider,
  ColorPicker,
  Form,
  Card,
  Tabs,
  Space,
  Divider,
  InputNumber,
  message,
  Radio,
  Badge,
  Tooltip,
  Upload
} from 'antd';
import {
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  EyeOutlined,
  BranchesOutlined,
  SecurityScanOutlined,
  SaveOutlined,
  ReloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined
} from '@ant-design/icons';
import type { Color } from 'antd/es/color-picker';

const { TabPane } = Tabs;
const { TextArea } = Input;

// 用户设置表单验证架构
const userSettingsSchema = z.object({
  // 个人信息
  profile: z.object({
    displayName: z.string().min(1, '显示名称不能为空').max(50, '显示名称不能超过50个字符'),
    email: z.string().email('邮箱格式不正确').optional().or(z.literal('')),
    bio: z.string().max(200, '个人简介不能超过200个字符').optional(),
    avatar: z.string().optional(),
    timezone: z.string().default('Asia/Shanghai'),
    language: z.enum(['zh-CN', 'en-US']).default('zh-CN')
  }),

  // AI 设置
  ai: z.object({
    preferredModel: z.enum(['gpt-4', 'gpt-3.5-turbo', 'claude-3', 'local']).default('gpt-4'),
    temperature: z.number().min(0).max(2).default(0.7),
    maxTokens: z.number().min(100).max(4000).default(2000),
    useKnowledgeBase: z.boolean().default(true),
    autoSave: z.boolean().default(true),
    streamResponse: z.boolean().default(true)
  }),

  // 界面设置
  ui: z.object({
    theme: z.enum(['light', 'dark', 'auto']).default('light'),
    primaryColor: z.string().default('#1890ff'),
    fontSize: z.enum(['small', 'medium', 'large']).default('medium'),
    layout: z.enum(['compact', 'comfortable', 'spacious']).default('comfortable'),
    showWelcomeScreen: z.boolean().default(true),
    enableAnimations: z.boolean().default(true),
    sidebarCollapsed: z.boolean().default(false)
  }),

  // 通知设置
  notifications: z.object({
    emailNotifications: z.boolean().default(true),
    pushNotifications: z.boolean().default(true),
    soundEnabled: z.boolean().default(true),
    chatNotifications: z.boolean().default(true),
    systemUpdates: z.boolean().default(true),
    quietHours: z.object({
      enabled: z.boolean().default(false),
      start: z.string().default('22:00'),
      end: z.string().default('08:00')
    })
  }),

  // 隐私设置
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'team']).default('team'),
    shareUsageData: z.boolean().default(false),
    allowDataCollection: z.boolean().default(false),
    sessionTimeout: z.number().min(15).max(480).default(60) // 分钟
  }),

  // 快捷键设置
  shortcuts: z.array(z.object({
    id: z.string(),
    name: z.string(),
    key: z.string(),
    action: z.string(),
    enabled: z.boolean().default(true)
  })).default([]),

  // 自定义标签
  customTags: z.array(z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
    description: z.string().optional()
  })).default([])
});

type UserSettingsData = z.infer<typeof userSettingsSchema>;

interface UserSettingsFormProps {
  onSave: (data: UserSettingsData) => Promise<void>;
  loading?: boolean;
  initialData?: Partial<UserSettingsData>;
}

export const UserSettingsForm: React.FC<UserSettingsFormProps> = ({
  onSave,
  loading = false,
  initialData = {}
}) => {
  const [activeTab, setActiveTab] = React.useState('profile');
  const [hasChanges, setHasChanges] = React.useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
    setValue
  } = useForm<UserSettingsData>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      profile: {
        displayName: '',
        email: '',
        bio: '',
        timezone: 'Asia/Shanghai',
        language: 'zh-CN',
        ...initialData.profile
      },
      ai: {
        preferredModel: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000,
        useKnowledgeBase: true,
        autoSave: true,
        streamResponse: true,
        ...initialData.ai
      },
      ui: {
        theme: 'light',
        primaryColor: '#1890ff',
        fontSize: 'medium',
        layout: 'comfortable',
        showWelcomeScreen: true,
        enableAnimations: true,
        sidebarCollapsed: false,
        ...initialData.ui
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        soundEnabled: true,
        chatNotifications: true,
        systemUpdates: true,
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '08:00'
        },
        ...initialData.notifications
      },
      privacy: {
        profileVisibility: 'team',
        shareUsageData: false,
        allowDataCollection: false,
        sessionTimeout: 60,
        ...initialData.privacy
      },
      shortcuts: initialData.shortcuts || [],
      customTags: initialData.customTags || []
    },
    mode: 'onChange'
  });

  const { fields: shortcutFields, append: appendShortcut, remove: removeShortcut } = useFieldArray({
    control,
    name: 'shortcuts'
  });

  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control,
    name: 'customTags'
  });

  const watchedValues = watch();

  React.useEffect(() => {
    setHasChanges(isDirty);
  }, [isDirty]);

  const handleFormSubmit = async (data: UserSettingsData) => {
    try {
      await onSave(data);
      setHasChanges(false);
      message.success('设置保存成功！');
    } catch (error) {
      message.error('保存失败，请稍后重试');
    }
  };

  const handleReset = () => {
    reset();
    setHasChanges(false);
    message.info('设置已重置');
  };

  const modelOptions = [
    { value: 'gpt-4', label: 'GPT-4', description: '最强大的模型' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', description: '快速响应' },
    { value: 'claude-3', label: 'Claude-3', description: '平衡性能' },
    { value: 'local', label: '本地模型', description: '私有部署' }
  ];

  const timezoneOptions = [
    { value: 'Asia/Shanghai', label: '北京时间 (UTC+8)' },
    { value: 'UTC', label: '协调世界时 (UTC)' },
    { value: 'America/New_York', label: '纽约时间 (UTC-5)' },
    { value: 'Europe/London', label: '伦敦时间 (UTC+0)' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <SettingOutlined className="text-blue-600" />
            用户设置
          </h2>
          <p className="text-gray-600 mt-1">个性化配置您的使用体验</p>
        </div>
        
        <Space>
          {hasChanges && (
            <Badge dot>
              <Button 
                type="primary" 
                icon={<SaveOutlined />}
                onClick={handleSubmit(handleFormSubmit)}
                loading={loading}
              >
                保存更改
              </Button>
            </Badge>
          )}
          <Button 
            icon={<ReloadOutlined />}
            onClick={handleReset}
            disabled={!hasChanges}
          >
            重置
          </Button>
        </Space>
      </div>

      <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* 个人信息 */}
          <TabPane
            tab={
              <span>
                <UserOutlined />
                个人信息
              </span>
            }
            key="profile"
          >
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    显示名称 *
                  </label>
                  <Controller
                    name="profile.displayName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="请输入显示名称"
                        status={errors.profile?.displayName ? 'error' : ''}
                      />
                    )}
                  />
                  {errors.profile?.displayName && (
                    <p className="mt-1 text-sm text-red-600">{errors.profile.displayName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    邮箱地址
                  </label>
                  <Controller
                    name="profile.email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        placeholder="请输入邮箱地址"
                        status={errors.profile?.email ? 'error' : ''}
                      />
                    )}
                  />
                  {errors.profile?.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.profile.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    时区设置
                  </label>
                  <Controller
                    name="profile.timezone"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="选择时区"
                        options={timezoneOptions}
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    界面语言
                  </label>
                  <Controller
                    name="profile.language"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={[
                          { value: 'zh-CN', label: '简体中文' },
                          { value: 'en-US', label: 'English' }
                        ]}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  个人简介
                </label>
                <Controller
                  name="profile.bio"
                  control={control}
                  render={({ field }) => (
                    <TextArea
                      {...field}
                      rows={3}
                      placeholder="简单介绍一下自己..."
                      showCount
                      maxLength={200}
                      status={errors.profile?.bio ? 'error' : ''}
                    />
                  )}
                />
                {errors.profile?.bio && (
                  <p className="mt-1 text-sm text-red-600">{errors.profile.bio.message}</p>
                )}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  头像上传
                </label>
                <Upload
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={() => false}
                >
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>上传头像</div>
                  </div>
                </Upload>
              </div>
            </Card>
          </TabPane>

          {/* AI 设置 */}
          <TabPane
            tab={
              <span>
                <BranchesOutlined />
                AI 配置
              </span>
            }
            key="ai"
          >
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    首选模型
                  </label>
                  <Controller
                    name="ai.preferredModel"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="选择 AI 模型"
                        options={modelOptions.map(option => ({
                          value: option.value,
                          label: (
                            <div>
                              <div>{option.label}</div>
                              <div className="text-xs text-gray-500">{option.description}</div>
                            </div>
                          )
                        }))}
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    最大令牌数: {watchedValues.ai?.maxTokens}
                  </label>
                  <Controller
                    name="ai.maxTokens"
                    control={control}
                    render={({ field }) => (
                      <Slider
                        {...field}
                        min={100}
                        max={4000}
                        step={100}
                        marks={{
                          100: '100',
                          1000: '1000',
                          2000: '2000',
                          4000: '4000'
                        }}
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    创造性: {watchedValues.ai?.temperature}
                    <Tooltip title="控制 AI 回答的创造性程度，数值越高越有创造性">
                      <span className="ml-1 text-gray-400">(?)</span>
                    </Tooltip>
                  </label>
                  <Controller
                    name="ai.temperature"
                    control={control}
                    render={({ field }) => (
                      <Slider
                        {...field}
                        min={0}
                        max={2}
                        step={0.1}
                        marks={{
                          0: '保守',
                          1: '平衡',
                          2: '创新'
                        }}
                      />
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>启用知识库</span>
                    <Controller
                      name="ai.useKnowledgeBase"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>自动保存对话</span>
                    <Controller
                      name="ai.autoSave"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>流式响应</span>
                    <Controller
                      name="ai.streamResponse"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabPane>

          {/* 界面设置 */}
          <TabPane
            tab={
              <span>
                <EyeOutlined />
                界面外观
              </span>
            }
            key="ui"
          >
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    主题模式
                  </label>
                  <Controller
                    name="ui.theme"
                    control={control}
                    render={({ field }) => (
                      <Radio.Group {...field} className="w-full">
                        <Radio.Button value="light">浅色</Radio.Button>
                        <Radio.Button value="dark">深色</Radio.Button>
                        <Radio.Button value="auto">自动</Radio.Button>
                      </Radio.Group>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    主色调
                  </label>
                  <Controller
                    name="ui.primaryColor"
                    control={control}
                    render={({ field }) => (
                      <ColorPicker
                        {...field}
                        value={field.value}
                        onChange={(color: Color) => field.onChange(color.toHexString())}
                        showText
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    字体大小
                  </label>
                  <Controller
                    name="ui.fontSize"
                    control={control}
                    render={({ field }) => (
                      <Radio.Group {...field}>
                        <Radio.Button value="small">小</Radio.Button>
                        <Radio.Button value="medium">中</Radio.Button>
                        <Radio.Button value="large">大</Radio.Button>
                      </Radio.Group>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    布局密度
                  </label>
                  <Controller
                    name="ui.layout"
                    control={control}
                    render={({ field }) => (
                      <Radio.Group {...field}>
                        <Radio.Button value="compact">紧凑</Radio.Button>
                        <Radio.Button value="comfortable">舒适</Radio.Button>
                        <Radio.Button value="spacious">宽松</Radio.Button>
                      </Radio.Group>
                    )}
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <span>显示欢迎屏幕</span>
                    <Controller
                      name="ui.showWelcomeScreen"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>启用动画效果</span>
                    <Controller
                      name="ui.enableAnimations"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>侧边栏默认折叠</span>
                    <Controller
                      name="ui.sidebarCollapsed"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabPane>

          {/* 通知设置 */}
          <TabPane
            tab={
              <span>
                <BellOutlined />
                通知提醒
              </span>
            }
            key="notifications"
          >
            <Card>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">邮件通知</div>
                      <div className="text-sm text-gray-500">接收重要更新邮件</div>
                    </div>
                    <Controller
                      name="notifications.emailNotifications"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">推送通知</div>
                      <div className="text-sm text-gray-500">浏览器推送提醒</div>
                    </div>
                    <Controller
                      name="notifications.pushNotifications"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">声音提醒</div>
                      <div className="text-sm text-gray-500">播放通知音效</div>
                    </div>
                    <Controller
                      name="notifications.soundEnabled"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">聊天通知</div>
                      <div className="text-sm text-gray-500">新消息提醒</div>
                    </div>
                    <Controller
                      name="notifications.chatNotifications"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>

                <Divider>免打扰时间</Divider>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium">启用免打扰模式</div>
                      <div className="text-sm text-gray-500">在指定时间内暂停通知</div>
                    </div>
                    <Controller
                      name="notifications.quietHours.enabled"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  {watchedValues.notifications?.quietHours?.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          开始时间
                        </label>
                        <Controller
                          name="notifications.quietHours.start"
                          control={control}
                          render={({ field }) => (
                            <Input {...field} type="time" />
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          结束时间
                        </label>
                        <Controller
                          name="notifications.quietHours.end"
                          control={control}
                          render={({ field }) => (
                            <Input {...field} type="time" />
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabPane>

          {/* 隐私设置 */}
          <TabPane
            tab={
              <span>
                <SecurityScanOutlined />
                隐私安全
              </span>
            }
            key="privacy"
          >
            <Card>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    个人资料可见性
                  </label>
                  <Controller
                    name="privacy.profileVisibility"
                    control={control}
                    render={({ field }) => (
                      <Radio.Group {...field}>
                        <Space direction="vertical">
                          <Radio value="public">公开 - 所有人可见</Radio>
                          <Radio value="team">团队 - 仅团队成员可见</Radio>
                          <Radio value="private">私有 - 仅自己可见</Radio>
                        </Space>
                      </Radio.Group>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    会话超时时间 (分钟): {watchedValues.privacy?.sessionTimeout}
                  </label>
                  <Controller
                    name="privacy.sessionTimeout"
                    control={control}
                    render={({ field }) => (
                      <Slider
                        {...field}
                        min={15}
                        max={480}
                        step={15}
                        marks={{
                          15: '15分钟',
                          60: '1小时',
                          240: '4小时',
                          480: '8小时'
                        }}
                      />
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">分享使用数据</div>
                      <div className="text-sm text-gray-500">
                        帮助我们改进产品体验
                      </div>
                    </div>
                    <Controller
                      name="privacy.shareUsageData"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">允许数据收集</div>
                      <div className="text-sm text-gray-500">
                        收集匿名使用统计信息
                      </div>
                    </div>
                    <Controller
                      name="privacy.allowDataCollection"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabPane>
        </Tabs>

        <div className="mt-8 flex justify-end gap-3">
          <Button onClick={handleReset} disabled={!hasChanges}>
            重置更改
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={!hasChanges}
            icon={<SaveOutlined />}
          >
            保存设置
          </Button>
        </div>
      </Form>
    </div>
  );
};